"use client";

import { useMemo } from "react";
import { Header } from "@/boundary/Header";
import { ReportPeriodToggle } from "@/boundary/ReportPeriodToggle";
import type { Report, UserAccountDTO } from "@/entity/UserAccount";
import { profileToPath } from "@/entity/UserProfile";

// GenerateWeeklyReportPage
export function GenerateWeeklyReportPage({
  account,
  weeklyReport,
}: {
  account: UserAccountDTO;
  weeklyReport: Report[];
}) {
  const reports = weeklyReport;

  const insights = useMemo(() => {
    const latest = reports[reports.length - 1];

    return {
      totalUsers: latest?.totalUsers ?? 0,
      newUsers: reports.reduce((sum, report) => sum + report.newUsers, 0),
      activeUsers: latest?.activeUsers ?? 0,
      suspendedUsers: latest?.suspendedUsers ?? 0,
      pendingUsers: latest?.pendingUsers ?? 0,
    };
  }, [reports]);

  // displayWeeklyReport()
  const displayWeeklyReport = () => (
    <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="mt-2 text-4xl font-bold">Weekly Reports</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ReportPeriodToggle profilePath={profileToPath(account.profile)} active="weekly" />
          <button
            type="button"
            onClick={() => downloadCSV(reports)}
            className="flex items-center gap-2 rounded-2xl bg-[#a45f00] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#8a5000]"
          >
            <DownloadIcon />
            Download
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-2xl border border-[#a45f00] bg-white/40 px-4 py-3 text-sm font-semibold text-[#a45f00] transition hover:bg-[#fff2df]"
          >
            <PrintIcon />
            Print
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <InsightCard label="Total Users" value={insights.totalUsers} tone="black" />
        <InsightCard label="New Users" value={insights.newUsers} tone="orange" />
        <InsightCard label="Active" value={insights.activeUsers} tone="green" />
        <InsightCard label="Suspended" value={insights.suspendedUsers} tone="red" />
        <InsightCard label="Pending" value={insights.pendingUsers} tone="pending" />
      </div>

      <div className="mt-8 overflow-hidden rounded-4xl border border-[#FFB347] bg-white/40 shadow-lg">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="border-b border-[#f0d8bd] text-sm text-[#6f6258]">
              <th className="px-6 py-5 text-center font-bold">Date Range</th>
              <th className="px-6 py-5 text-center font-bold">Total Users</th>
              <th className="px-6 py-5 text-center font-bold">New Users</th>
              <th className="px-6 py-5 text-center font-bold">Active</th>
              <th className="px-6 py-5 text-center font-bold">Suspended</th>
              <th className="px-6 py-5 text-center font-bold">Pending</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.period} className="border-b border-[#f0d8bd]/70 last:border-b-0">
                <td className="px-6 py-5 text-center text-sm font-semibold">{report.period}</td>
                <td className="px-6 py-5 text-center text-sm">{report.totalUsers}</td>
                <td className="px-6 py-5 text-center text-sm">{report.newUsers}</td>
                <td className="px-6 py-5 text-center text-sm text-green-700">{report.activeUsers}</td>
                <td className="px-6 py-5 text-center text-sm text-[#c83232]">{report.suspendedUsers}</td>
                <td className="px-6 py-5 text-center text-sm text-[#a45f00]">{report.pendingUsers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  return (
    <main className="min-h-screen bg-[#fffaf5] text-[#1d2520]">
      <Header account={account} />
      {displayWeeklyReport()}
    </main>
  );
}

function InsightCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "black" | "orange" | "green" | "red" | "pending";
}) {
  const colorByTone = {
    black: "text-[#1d2520]",
    orange: "text-[#FFB347]",
    green: "text-green-700",
    red: "text-[#c83232]",
    pending: "text-[#a45f00]",
  };
  const colorClass = colorByTone[tone];

  return (
    <article className="rounded-4xl border border-[#FFB347] bg-white/40 p-5 shadow-lg transition hover:scale-110">
      <p className="text-sm font-bold text-[#6f6258]">{label}</p>
      <div className={`mt-5 flex items-center gap-3 ${colorClass}`}>
        <p className="text-4xl font-bold">{value}</p>
        <UserGroupIcon />
      </div>
    </article>
  );
}

function UserGroupIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-10 shrink-0"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z"
        clipRule="evenodd"
      />
      <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-5"
      aria-hidden="true"
    >
      <path d="M12 1.5a.75.75 0 0 1 .75.75V7.5h-1.5V2.25A.75.75 0 0 1 12 1.5ZM11.25 7.5v5.69l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V7.5h3.75a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h3.75Z" />
    </svg>
  );
}

function PrintIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="size-5"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M7.875 1.5C6.839 1.5 6 2.34 6 3.375v2.99c-.426.053-.851.11-1.274.174-1.454.218-2.476 1.483-2.476 2.917v6.294a3 3 0 0 0 3 3h.27l-.155 1.705A1.875 1.875 0 0 0 7.232 22.5h9.536a1.875 1.875 0 0 0 1.867-2.045l-.155-1.705h.27a3 3 0 0 0 3-3V9.456c0-1.434-1.022-2.7-2.476-2.917A48.716 48.716 0 0 0 18 6.366V3.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM16.5 6.205v-2.83A.375.375 0 0 0 16.125 3h-8.25a.375.375 0 0 0-.375.375v2.83a49.353 49.353 0 0 1 9 0Zm-.217 8.265c.178.018.317.16.333.337l.526 5.784a.375.375 0 0 1-.374.409H7.232a.375.375 0 0 1-.374-.409l.526-5.784a.373.373 0 0 1 .333-.337 41.741 41.741 0 0 1 8.566 0Zm.967-3.97a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H18a.75.75 0 0 1-.75-.75V10.5ZM15 9.75a.75.75 0 0 0-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 0 0 .75-.75V10.5a.75.75 0 0 0-.75-.75H15Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function downloadCSV(reports: Report[]) {
  const headers = [
    "Date Range",
    "Start Date",
    "End Date",
    "Total Users",
    "New Users",
    "Active",
    "Suspended",
    "Pending",
  ];
  const rows = reports.map((report) => [
    report.period,
    report.startDate,
    report.endDate,
    String(report.totalUsers),
    String(report.newUsers),
    String(report.activeUsers),
    String(report.suspendedUsers),
    String(report.pendingUsers),
  ]);
  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = "weekly-user-report.csv";
  link.click();
  URL.revokeObjectURL(url);
}
