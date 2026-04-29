import Link from "next/link";
import { RouteController } from "@/controller/RouteController";
import { getRoleLabel, type AccountRole, type UserProfile } from "@/entity/UserAccount";

const dashboardCopy: Record<AccountRole, string> = {
  admin: "Manage platform users, approve management accounts, and monitor system activity.",
  donee: "View assistance requests, campaign support, and profile information.",
  fundraiser: "Create fundraising campaigns, review donors, and track campaign progress.",
  "platform-management": "Moderate platform records, support users, and review operational tasks.",
};

export function DashboardBoundary({
  role,
  profile,
  children,
}: {
  role: AccountRole;
  profile: UserProfile;
  children?: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#1d2520]">
      <header className="border-b border-[#dfdacd] bg-[#fffdf8]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="text-lg font-bold">
            ShibaInu Giving
          </Link>
          <Link href={RouteController.getLogoutPath(role)} className="text-sm font-semibold text-[#1f5a46]">
            Log Out
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a5a2f]">
          Dashboard
        </p>
        <h1 className="mt-4 text-4xl font-bold">{getRoleLabel(role)} Dashboard</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[#586158]">
          {dashboardCopy[role]}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <DashboardCard title="Profile" text={`${profile.username} (${profile.email})`} />
          <DashboardCard title="Tasks" text="Role-specific actions will be connected here." />
          <DashboardCard title="Reports" text="Activity summaries will be shown here." />
        </div>
        {children}
      </section>
    </main>
  );
}

function DashboardCard({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-lg border border-[#dfdacd] bg-[#fffdf8] p-5 shadow-sm">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-[#586158]">{text}</p>
    </article>
  );
}
