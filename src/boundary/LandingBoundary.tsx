import Link from "next/link";
import {
  ArrowRight,
  HeartHandshake,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export function LandingBoundary() {
  return (
    <main className="min-h-screen bg-[#fffaf5] text-[#1d2520]">
      <header className="border-b border-[#f0d8bd] bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link href="/" className="text-xl font-black tracking-tight">
            Hope Spring
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-xl bg-[#FFB347] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#FFBE5C] sm:inline-flex"
            >
              Log In
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
        <div>
          <p className="inline-flex rounded-full border border-[#f0d8bd] bg-white px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-[#9b5d12]">
            Online Fundraising Platform
          </p>

          <h1 className="mt-6 max-w-3xl text-5xl font-black leading-tight tracking-tight lg:text-7xl">
            Support meaningful causes with Hope Spring.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6f6258]">
            A simple and trustworthy platform where donees can discover
            fundraising activities, and fundraisers can create, manage, and
            track their campaigns.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#FFB347] px-6 py-4 font-bold text-white shadow-sm transition hover:bg-[#FFBE5C]"
            >
              Start Fundraising
              <ArrowRight className="h-5 w-5" />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-2xl border border-[#f0d8bd] bg-white px-6 py-4 font-bold text-[#9b5d12] shadow-sm transition hover:bg-[#fff2df]"
            >
              Browse FRAs
            </Link>
          </div>

          <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
            <MiniStat value="100%" label="Campaign visibility" />
            <MiniStat value="24/7" label="Online access" />
            <MiniStat value="Easy" label="Donation tracking" />
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#f0d8bd] bg-white p-5 shadow-sm">
          <div className="rounded-[1.5rem] bg-[#fff2df] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9b5d12]">
                  Featured FRA
                </p>
                <h2 className="mt-2 text-3xl font-black">
                  Help Students Continue School
                </h2>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#c77700]">
                <HeartHandshake className="h-7 w-7" />
              </div>
            </div>

            <p className="mt-5 text-[#6f6258]">
              Support education campaigns and help communities reach their
              fundraising goals.
            </p>

            <div className="mt-6 h-4 overflow-hidden rounded-full bg-white">
              <div className="h-full w-[68%] rounded-full bg-[#FFB347]" />
            </div>

            <div className="mt-4 flex items-center justify-between font-bold">
              <p>$3,400 raised</p>
              <p>$5,000 goal</p>
            </div>

            <p className="mt-2 font-bold text-[#c77700]">68% funded</p>
          </div>

          <div className="mt-5 grid gap-3">
            <FeatureCard
              icon={<Search className="h-5 w-5" />}
              title="Discover FRAs"
              text="Search and browse campaigns by interest and category."
            />

            <FeatureCard
              icon={<Sparkles className="h-5 w-5" />}
              title="Manage Campaigns"
              text="Create, update, close, and track your fundraising activities."
            />

            <FeatureCard
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Clear Progress"
              text="View raised amount, deadline, views, and recent donations."
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          <InfoBlock
            title="For Donees"
            text="Find causes, view campaign details, save favourites, and track donation history."
          />
          <InfoBlock
            title="For Fundraisers"
            text="Create FRAs, monitor progress, view donations, and manage campaign status."
          />
        </div>
      </section>
    </main>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-[#f0d8bd] bg-white p-4 shadow-sm">
      <p className="text-2xl font-black">{value}</p>
      <p className="mt-1 text-sm text-[#6f6258]">{label}</p>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-3 rounded-2xl border border-[#f0d8bd] bg-white p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fff2df] text-[#c77700]">
        {icon}
      </div>

      <div>
        <h3 className="font-bold">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-[#6f6258]">{text}</p>
      </div>
    </div>
  );
}

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-[#f0d8bd] bg-white p-6 shadow-sm">
      <h3 className="text-xl font-black">{title}</h3>
      <p className="mt-3 leading-7 text-[#6f6258]">{text}</p>
    </div>
  );
}