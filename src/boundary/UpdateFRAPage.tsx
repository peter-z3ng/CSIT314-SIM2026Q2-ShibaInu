"use client";

import { useState } from "react";
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

        <div className="flex gap-4">
          <div>

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
                    {value} h
                  </option>
                );
              })}
            </select>
          </div>

          <div>

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

export function UpdateFRAPage({
  account,
  fra,
}: {
  account: UserAccountDTO;
  fra: FRADTO;
}) {
  const [title, setTitle] = useState(fra.title);
  const [description, setDescription] = useState(fra.description || "");
  const [categoryId, setCategoryId] = useState(fra.categoryId);
  const [endDate, setEndDate] = useState(toDateTimeInputValue(fra.endDate));
  const [status, setStatus] = useState(fra.status);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!endDate) {
      setMessage("End date is required.");
      return;
    }

    try {
      await updateFRAAction({
        fraId: fra.fraId,
        userId: account.userId,
        categoryId,
        title,
        description,
        endDate,
        status,
      });

      setMessage("FRA updated successfully.");
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
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9b5d12]">
          Fundraiser
        </p>

        <h1 className="mt-2 text-3xl font-bold">Update FRA</h1>

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

            <div>
              <label className="text-sm font-semibold">Status</label>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="mt-2 w-full rounded-md border border-[#f0d8bd] px-4 py-3 outline-none focus:border-[#FFB347]"
              >
                <option value="active">active</option>
                <option value="completed">completed</option>
                <option value="closed">closed</option>
              </select>
            </div>

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