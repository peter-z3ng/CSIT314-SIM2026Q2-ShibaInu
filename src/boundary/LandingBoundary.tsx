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

      <section className="flex min-h-screen max-w-[100vw] items-center justify-center text-center">
        <div>
          <h1 className="text-6xl font-bold leading-tight">
            Landing Page under maintenance
          </h1>
        </div>
      </section>
    </main>
  );
}
