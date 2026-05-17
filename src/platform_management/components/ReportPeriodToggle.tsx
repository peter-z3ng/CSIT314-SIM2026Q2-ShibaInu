import Link from "next/link";

type ReportPeriod = "daily" | "weekly" | "monthly";

export function ReportPeriodToggle({
  profilePath,
  active,
}: {
  profilePath: string;
  active: ReportPeriod;
}) {
  const links: { label: string; value: ReportPeriod; href: string }[] = [
    { label: "Daily", value: "daily", href: `/${profilePath}/reports` },
    { label: "Weekly", value: "weekly", href: `/${profilePath}/weekly-reports` },
    { label: "Monthly", value: "monthly", href: `/${profilePath}/monthly-reports` },
  ];

  return (
    <div className="flex rounded-2xl border border-[#f0d8bd] bg-white p-1">
      {links.map((link) => (
        <Link
          key={link.value}
          href={link.href}
          className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
            active === link.value
              ? "bg-[#FFB347] text-white"
              : "text-[#1d2520] hover:bg-[#fff2df] hover:text-[#FFB347]"
          }`}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
