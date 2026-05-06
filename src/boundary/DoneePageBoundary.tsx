import { Header } from "@/components/Header";
import type { UserAccountDTO } from "@/entity/UserAccount";

export function DoneePageBoundary({
  account,
  title,
}: {
  account: UserAccountDTO;
  title: string;
}) {
  return (
    <main className="min-h-screen bg-[#FFF4EC] text-[#111111]">
      <Header account={account} />
      <section className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-sm">
          <h1 className="text-4xl font-black text-[#FFB347]">{title}</h1>
        </div>
      </section>
    </main>
  );
}
