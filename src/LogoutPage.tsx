import { signOutAndRedirect } from "@/controller/authActions";
import type { Profile } from "@/entity/UserProfile";

export function LogOutPage({ profile }: { profile: Profile }) {
  // displaySuccess()
  const displaySuccess = () => (
    <main className="flex min-h-screen items-center justify-center bg-[#FFF4EC] px-5 py-10 text-[#1d2520]">
      <section className="w-full max-w-md rounded-4xl border border-white bg-[#FFF4EC] p-6 text-center shadow-2xl shadow-orange-300">
        <div className="space-y-5">
          <div>
            <h2 className="text-2xl font-semibold">Logged out successfully</h2>
          </div>
          <form action={signOutAndRedirect}>
            <SubmitButton label="Return to Login" />
          </form>
        </div>
      </section>
    </main>
  );

  return displaySuccess();
}

function SubmitButton({ label }: { label: string }) {
  return (
    <button className="h-11 w-full rounded-md bg-[#FFB347] px-4 text-sm font-semibold text-white transition hover:bg-[#FFBE5C]">
      {label}
    </button>
  );
}
