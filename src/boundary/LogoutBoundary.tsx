import { signOutAndRedirect } from "@/controller/authActions";
import { getRoleLabel, type AccountRole } from "@/entity/UserAccount";

export function LogoutBoundary({ role }: { role: AccountRole }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f5ef] px-5 text-[#1d2520]">
      <section className="w-full max-w-md rounded-lg border border-[#dfdacd] bg-[#fffdf8] p-6 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a5a2f]">
          Logged Out
        </p>
        <h1 className="mt-3 text-3xl font-bold">{getRoleLabel(role)}</h1>
        <p className="mt-3 text-sm leading-6 text-[#586158]">
          Your session has ended for this role area.
        </p>
        <form action={signOutAndRedirect}>
          <button className="mt-6 inline-flex h-11 items-center rounded-md bg-[#1f5a46] px-5 text-sm font-semibold text-white transition hover:bg-[#174435]">
            Return to Login
          </button>
        </form>
      </section>
    </main>
  );
}
