import Link from "next/link";
import { RouteController } from "@/controller/RouteController";
import { isAdminProfile, type UserAccount } from "@/entity/Profile";

const adminCopy = "Manage platform users, approve account requests, and create profiles.";
const userCopy = "View account details, profile-specific tasks, and activity summaries.";

export function DashboardBoundary({
  account,
  children,
}: {
  account: UserAccount;
  children?: React.ReactNode;
}) {
  const dashboardCopy = isAdminProfile(account.profile) ? adminCopy : userCopy;

  return (
    <main className="min-h-screen bg-[#f7f5ef] text-[#1d2520]">
      <header className="border-b border-[#dfdacd] bg-[#fffdf8]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="text-lg font-bold">
            ShibaInu Giving
          </Link>
          <Link
            href={RouteController.getLogoutPath(account.profile)}
            className="text-sm font-semibold text-[#1f5a46]"
          >
            Log Out
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8a5a2f]">
          Dashboard
        </p>
        <h1 className="mt-4 text-4xl font-bold">{account.profile.profile} Dashboard</h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-[#586158]">
          {dashboardCopy}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <DashboardCard title="Account" text={`${account.username} (${account.email})`} />
          <DashboardCard title="Profile" text={account.profile.profile} />
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
