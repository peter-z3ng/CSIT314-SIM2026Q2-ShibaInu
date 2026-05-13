"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import type { FRADTO } from "@/entity/FRA";
import type { UserAccountDTO } from "@/entity/UserAccount";
import { updateFRAAction } from "@/controller/updateFRAActions";
import { toDateTimeInputValue } from "@/lib/datetime";

function DateTimeInput({
  label,
  value,
  onChange,
  minDate,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  minDate?: string;
}) {
  const date = value ? value.slice(0, 10) : "";
  const hour = value ? value.slice(11, 13) : "00";
  const minute = value ? value.slice(14, 16) : "00";

  function updateDateTime(newDate: string, newHour: string, newMinute: string) {
    if (!newDate) {
      onChange("");
      return;
    }

    onChange(`${newDate}T${newHour}:${newMinute}`);
  }

  return (
    <div>
      <label className="text-sm font-semibold">{label}</label>

      <div className="mt-2 flex flex-col gap-3">
        <input
          type="date"
          value={date}
          min={minDate}
          onChange={(event) =>
            updateDateTime(event.target.value, hour, minute)
          }
          className="w-full rounded-md border border-[#f0d8bd] px-4 py-3 outline-none focus:border-[#FFB347]"
          required
        />

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#6f6258]">Hr</span>

            <select
              value={hour}
              onChange={(event) =>
                updateDateTime(date, event.target.value, minute)
              }
              className="h-14 w-32 rounded-md border border-[#f0d8bd] bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-[#FFB347]"
              required
            >
              {Array.from({ length: 24 }, (_, index) => {
                const value = String(index).padStart(2, "0");

                return (
                  <option key={value} value={value}>
                    {value} hr
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[#6f6258]">Min</span>

            <select
              value={minute}
              onChange={(event) =>
                updateDateTime(date, hour, event.target.value)
              }
              className="h-14 w-32 rounded-md border border-[#f0d8bd] bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-[#FFB347]"
              required
            >
              {Array.from({ length: 60 }, (_, index) => {
                const value = String(index).padStart(2, "0");

                return (
                  <option key={value} value={value}>
                    {value} min
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

function getStatusClass(status: string) {
  if (status === "completed") {
    return "bg-green-100 text-green-700 border-green-200";
  }

  if (status === "closed") {
    return "bg-red-100 text-red-600 border-red-200";
  }

  return "bg-[#fff2df] text-[#c77700] border-[#f0d8bd]";
}

export function UpdateFRAPage({
  account,
  fra,
}: {
  account: UserAccountDTO;
  fra: FRADTO;
}) {
  const router = useRouter();
  const profilePath = account.profile.profile.toLowerCase().replace(" ", "-");

  const [title, setTitle] = useState(fra.title);
  const [description, setDescription] = useState(fra.description || "");
  const [categoryId, setCategoryId] = useState(fra.categoryId);
  const [endDate, setEndDate] = useState(toDateTimeInputValue(fra.endDate));
  const [status, setStatus] = useState(fra.status);
  const [statusTouched, setStatusTouched] = useState(false);
  const [message, setMessage] = useState("");

  function handleStatusChange(newStatus: string) {
    if (newStatus === status) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to change the FRA status to "${newStatus}"?`,
    );

    if (!confirmed) {
      return;
    }

    setStatus(newStatus);
    setStatusTouched(true);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!endDate) {
      setMessage("End date is required.");
      return;
    }

    if (new Date(endDate) <= new Date(fra.startDate)) {
      setMessage("End date must be later than start date.");
      return;
    }

    const updatedStatus = statusTouched
      ? status
      : new Date(endDate) <= new Date()
        ? "closed"
        : "active";

    try {
      await updateFRAAction({
        fraId: fra.fraId,
        userId: account.userId,
        categoryId,
        title,
        description,
        endDate,
        status: updatedStatus,
      });

      router.push(`/${profilePath}/my-fras/${fra.fraId}?updated=true`);
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to update FRA.",
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#fffaf5] text-[#1d2520]">
      <Header account={account} />

      <main className="mx-auto max-w-3xl px-5 py-8">
        <Link
          href={`/${profilePath}/my-fras/${fra.fraId}`}
          className="text-sm font-semibold text-[#9b5d12] hover:underline"
        >
          ← Back to FRA Details
        </Link>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-[#9b5d12]">
          Fundraiser
        </p>

        <div className="mt-2 flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Update FRA</h1>

          <select
            value={status}
            onChange={(event) => handleStatusChange(event.target.value)}
            className={`h-10 w-40 rounded-2xl border px-4 text-center text-xs font-bold uppercase tracking-[0.15em] outline-none ${getStatusClass(
              status,
            )}`}
          >
            <option value="active">active</option>
            <option value="closed">closed</option>
            <option value="completed">completed</option>
          </select>
        </div>

        <p className="mt-2 text-[#6f6258]">
          Update your fundraising activity details.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border border-[#f0d8bd] bg-white p-6 shadow-sm"
        >
          <div className="grid gap-5">
            <div>
              <label className="text-sm font-semibold">Title</label>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="mt-2 w-full rounded-md border border-[#f0d8bd] px-4 py-3 outline-none focus:border-[#FFB347]"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Description</label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="mt-2 min-h-[120px] w-full rounded-md border border-[#f0d8bd] px-4 py-3 outline-none focus:border-[#FFB347]"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Category ID</label>
              <input
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                className="mt-2 w-full rounded-md border border-[#f0d8bd] px-4 py-3 outline-none focus:border-[#FFB347]"
                required
              />
            </div>

            <DateTimeInput
              label="End Date"
              value={endDate}
              minDate={getCurrentDate()}
              onChange={setEndDate}
            />

            {message ? (
              <p className="text-sm font-semibold text-[#9b5d12]">
                {message}
              </p>
            ) : null}

            <button
              type="submit"
              className="rounded-md bg-[#FFB347] px-5 py-3 font-semibold text-white transition hover:bg-[#FFBE5C]"
            >
              Update FRA
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

function getCurrentDate() {
  return new Date().toISOString().slice(0, 10);
}