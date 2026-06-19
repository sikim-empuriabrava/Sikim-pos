import { NextRequest, NextResponse } from "next/server";
import {
  applyPosSessionCookie,
  createPosSessionCookie,
  getPosAuthConfig,
  getSafeRedirectPath,
  isSubmittedPasswordValid,
} from "@/lib/pos-auth";

function redirectToLogin(request: NextRequest, error: "config" | "invalid", nextPath: string) {
  const redirectUrl = new URL("/login", request.url);
  redirectUrl.searchParams.set("error", error);

  if (nextPath !== "/") {
    redirectUrl.searchParams.set("next", nextPath);
  }

  return NextResponse.redirect(redirectUrl, { status: 303 });
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const nextPath = getSafeRedirectPath(formData.get("next"));
  const submittedPassword = formData.get("password");
  const config = getPosAuthConfig();

  if (!config.ok) {
    return redirectToLogin(request, "config", nextPath);
  }

  if (
    typeof submittedPassword !== "string" ||
    !(await isSubmittedPasswordValid(submittedPassword, config.passwordHash))
  ) {
    return redirectToLogin(request, "invalid", nextPath);
  }

  const redirectUrl = new URL(nextPath, request.url);
  const response = NextResponse.redirect(redirectUrl, { status: 303 });
  const cookieValue = await createPosSessionCookie(config);
  applyPosSessionCookie(response, cookieValue, config);

  return response;
}

export function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/login", request.url));
}
