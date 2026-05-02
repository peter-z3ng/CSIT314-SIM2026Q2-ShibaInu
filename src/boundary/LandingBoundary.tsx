import Link from "next/link";

export function LandingBoundary() {
  return (
    <main className="min-h-screen bg-[#FFF4EC] text-[#1d2520]">
      <header className="border-b border-[#dfdacd] bg-[#fffdf8]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="text-lg font-bold">
            Hope Spring
          </Link>
          <Link
            href="/login"
            className="rounded-md bg-[#FFB347] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#FFBE5C]"
          >
            Log In
          </Link>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-16">
        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a5a2f]">
            Fundraising Platform
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight sm:text-6xl">
            Connect donees, fundraisers, and platform teams with trusted support.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#586158]">
            Manage help requests, fundraising campaigns, donor activity, and platform
            operations through role-based dashboards.
          </p>
        </div>
      </section>
    </main>
  );
}
