import Link from "next/link";
import Image from "next/image";
import { DoneeHeaderBoundary } from "@/boundary/DoneeHeaderBoundary";
import type { UserAccount } from "@/entity/UserAccount";

export function DoneeDashboardBoundary({ account }: { account: UserAccount }) {
  return (
    <main className="min-h-screen bg-[#FFF4EC] text-[#111111]">
      <DoneeHeaderBoundary account={account.toDTO()} />

      <div className="mx-auto max-w-none px-9 py-10">
        <section className="relative aspect-[1920/748] overflow-hidden rounded-3xl bg-[#111111]">
          <Image
            src="/donee-wc.gif"
            alt="Donee welcome animation"
            fill
            unoptimized
            className="object-contain"
          />
          <div className="absolute left-8 top-1/2 max-w-xl -translate-y-1/2 rounded-3xl border border-white/55 bg-[#FFB347]/10 p-7 shadow-2xl backdrop-blur-xs md:left-28 md:p-9">
            <h1 className="text-4xl font-black text-[#FFB347] md:text-6xl">Welcome back!</h1>
            <p className="mt-5 text-base leading-6 md:text-xl">
              Thank you for being a part of our mission.
              <br />
              Together, we can create a better tomorrow.
            </p>
          </div>
        </section>

        <section className="mt-8">
          <h2 className="px-5 text-2xl font-bold">Your Impact Summary</h2>
          <div className="mt-5 grid gap-7 md:grid-cols-3">
            <ImpactCard icon="$" label="Total Donations" value="$120.00" text="Thank you for your generosity!" />
            <ImpactCard icon="H" label="Campaigns Supported" value="5" text="Keep supporting more causes!" />
            <ImpactCard icon="U" label="Active Contributions" value="2" text="You are making an impact!" />
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-5 flex items-center justify-between px-5">
            <h2 className="text-2xl font-bold">Highlighted Campaign</h2>
            <Link href="#" className="text-2xl font-bold transition hover:text-[#0078ff]">
              View More&nbsp;&nbsp;&gt;
            </Link>
          </div>

          <article className="grid gap-8 rounded-2xl bg-white p-8 md:grid-cols-[280px_1fr_auto] md:items-center">
            <ImagePlaceholder size="campaign" />
            <div>
              <span className="inline-flex rounded-md bg-[#2b2b2b] px-3 py-1 text-base text-white">
                Education
              </span>
              <h3 className="mt-7 max-w-sm text-3xl font-black leading-8">
                Brighter Future:
                <br />
                Education for all
              </h3>
              <p className="mt-5 max-w-sm text-lg leading-5">
                Help us provide quality education and learning materials to underprivileged
                children
              </p>
              <div className="mt-6 flex flex-wrap gap-8 text-lg">
                <span>Ends in 30days</span>
                <span>253 Donors</span>
              </div>
            </div>
            <div className="w-full md:w-64">
              <p className="text-lg">$7,500 raised of $10,000</p>
              <div className="mt-5 flex items-center gap-4">
                <div className="h-1 w-full bg-[#d8d8d8]">
                  <div className="h-1 w-3/4 bg-[#0078ff]" />
                </div>
                <span className="text-lg font-bold text-[#0078ff]">75%</span>
              </div>
              <Link
                href="#"
                className="mt-10 inline-flex h-12 items-center rounded-md bg-[#0078ff] px-5 text-lg text-white transition hover:bg-[#006be3]"
              >
                View Details
              </Link>
            </div>
          </article>
        </section>

        <section className="mt-8 rounded-2xl bg-white px-12 py-6">
          <h2 className="text-2xl font-bold">Announcements</h2>
          <div className="mt-5 grid gap-2">
            <Announcement
              title="New environmental campaigns added!"
              text="Check them out in Browse."
              time="now"
            />
            <Announcement
              title="Thank you donors!"
              text="Together we reached 10,000 donations this month."
              time="1 week ago"
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function ImpactCard({
  icon,
  label,
  value,
  text,
}: {
  icon: string;
  label: string;
  value: string;
  text: string;
}) {
  return (
    <article className="grid grid-cols-[88px_1fr] items-center rounded-2xl bg-white px-6 py-6">
      <div className="grid h-20 w-20 place-items-center rounded-full bg-[#9a9a9a] text-5xl">
        {icon}
      </div>
      <div>
        <p className="text-base">{label}</p>
        <p className="mt-1 text-3xl font-black">{value}</p>
        <p className="mt-2 text-base">{text}</p>
      </div>
    </article>
  );
}

function Announcement({
  title,
  text,
  time,
}: {
  title: string;
  text: string;
  time: string;
}) {
  return (
    <article className="grid grid-cols-[48px_1fr_auto] items-center gap-4 rounded-b-2xl bg-white px-4 py-3 shadow-[0_8px_22px_rgba(0,0,0,0.16)]">
      <div className="h-9 w-9 rounded-full border border-[#d8d8d8] bg-[#f4f4f4]" />
      <div>
        <p className="font-bold">{title}</p>
        <p>{text}</p>
      </div>
      <p className="self-start text-sm text-[#b0b0b0]">{time}</p>
    </article>
  );
}

function ImagePlaceholder({ size }: { size: "large" | "campaign" }) {
  const sizeClass = size === "large" ? "h-44 w-44" : "h-64 w-64";

  return (
    <div className={`${sizeClass} relative rounded-2xl border-4 border-[#222222]`}>
      <div className="absolute left-8 top-8 h-8 w-8 rounded-full border-4 border-[#222222]" />
      <div className="absolute bottom-0 left-7 h-32 w-40 rotate-45 border-l-4 border-t-4 border-[#222222]" />
    </div>
  );
}
