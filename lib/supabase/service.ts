import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicConfigStatus } from "./config";

const SUPABASE_SERVICE_KEY = "SUPABASE_SERVICE_ROLE_KEY";

export type SupabaseServiceConfigStatus = {
  isConfigured: boolean;
  publicUrlPresent: boolean;
  publicUrlValid: boolean;
  publicUrlHost: string | null;
  serviceKeyPresent: boolean;
  helperEnabled: boolean;
  missingKeys: string[];
};

function readEnvValue(env: NodeJS.ProcessEnv, key: string) {
  return env[key]?.trim() ?? "";
}

export function getSupabaseServiceConfigStatus(
  env: NodeJS.ProcessEnv = process.env,
): SupabaseServiceConfigStatus {
  const publicStatus = getSupabasePublicConfigStatus(env);
  const serviceKey = readEnvValue(env, SUPABASE_SERVICE_KEY);
  const missingKeys = [
    publicStatus.urlPresent ? null : "NEXT_PUBLIC_SUPABASE_URL",
    serviceKey ? null : SUPABASE_SERVICE_KEY,
  ].filter((key): key is string => Boolean(key));
  const isConfigured = publicStatus.urlValid && Boolean(serviceKey);

  return {
    isConfigured,
    publicUrlPresent: publicStatus.urlPresent,
    publicUrlValid: publicStatus.urlValid,
    publicUrlHost: publicStatus.urlHost,
    serviceKeyPresent: Boolean(serviceKey),
    helperEnabled: isConfigured,
    missingKeys,
  };
}

export function createServerSupabaseServiceClient(): SupabaseClient | null {
  const status = getSupabaseServiceConfigStatus();

  if (!status.isConfigured || !status.publicUrlHost) {
    return null;
  }

  const url = readEnvValue(process.env, "NEXT_PUBLIC_SUPABASE_URL");
  const serviceKey = readEnvValue(process.env, SUPABASE_SERVICE_KEY);

  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}
