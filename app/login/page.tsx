import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getPosAuthConfig,
  getPosAuthConfigMessage,
  getSafeRedirectPath,
  POS_SESSION_COOKIE_NAME,
  verifyPosSession,
} from "@/lib/pos-auth";

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const nextPath = getSafeRedirectPath(getSingleParam(params.next));
  const error = getSingleParam(params.error);
  const cookieStore = await cookies();
  const isAlreadyAuthorized = await verifyPosSession(
    cookieStore.get(POS_SESSION_COOKIE_NAME)?.value,
  );

  if (isAlreadyAuthorized) {
    redirect(nextPath);
  }

  const config = getPosAuthConfig();
  const configMessage = getPosAuthConfigMessage(config);

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-slate-950 px-4 py-10 text-slate-100">
      <section className="grid w-full max-w-[460px] gap-6 rounded-lg border border-slate-800 bg-[#101728] p-6 shadow-2xl shadow-black/30">
        <div className="grid gap-3">
          <p className="text-xs font-black uppercase text-emerald-300">
            Sikim POS
          </p>
          <h1 className="text-3xl font-black tracking-normal">
            Acces intern restringit
          </h1>
          <p className="text-sm font-semibold leading-6 text-slate-300">
            Introdueix la contrasenya compartida del TPV per accedir a les rutes
            operatives. Aquesta porta es temporal fins a la futura autenticacio
            amb usuaris i permisos.
          </p>
        </div>

        {configMessage ? (
          <div className="rounded-md border border-amber-300/40 bg-amber-300/10 p-3 text-sm font-bold leading-6 text-amber-100">
            Configuracio pendent: {configMessage}. L&apos;aplicacio roman
            tancada fins configurar les variables de servidor.
          </div>
        ) : null}

        {error === "invalid" ? (
          <div className="rounded-md border border-rose-300/50 bg-rose-300/10 p-3 text-sm font-bold text-rose-100">
            Contrasenya incorrecta. Torna-ho a provar.
          </div>
        ) : null}

        <form action="/api/pos-auth/login" method="post" className="grid gap-4">
          <input type="hidden" name="next" value={nextPath} />
          <label className="grid gap-2 text-sm font-black text-slate-200">
            Contrasenya POS
            <input
              autoComplete="current-password"
              className="min-h-12 rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-base font-bold text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-300"
              disabled={!config.ok}
              name="password"
              required
              type="password"
            />
          </label>
          <button
            className="min-h-12 rounded-md border border-emerald-300 bg-emerald-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-200 disabled:border-slate-700 disabled:bg-slate-800 disabled:text-slate-500"
            disabled={!config.ok}
            type="submit"
          >
            Entrar al POS
          </button>
        </form>
      </section>
    </main>
  );
}
