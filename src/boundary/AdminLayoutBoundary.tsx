import { Header } from "@/components/Header";
import type { UserAccountDTO } from "@/entity/UserAccount";

export function AdminLayoutBoundary({
  account,
  title,
  eyebrow,
  children,
}: {
  account: UserAccountDTO;
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#FFF4EC] text-[#1d2520]">
      <Header account={account} />

      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#9b5d12]">
            {eyebrow}
          </p>
          <h1 className="mt-3 text-4xl font-bold">{title}</h1>
        </div>
        {children}
      </section>
    </main>
  );
}
