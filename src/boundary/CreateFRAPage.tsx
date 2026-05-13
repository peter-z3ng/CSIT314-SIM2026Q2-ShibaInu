"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import type { UserAccountDTO } from "@/entity/UserAccount";
import { createFRAAction } from "@/controller/CreateFRAActions";

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

      <div className="mt-2 flex flex-col gap-4">
        <input
          type="date"
          value={date}
          min={minDate}
          onChange={(e) => updateDateTime(e.target.value, hour, minute)}
          className="w-full rounded-md border border-[#f0d8bd] px-4 py-3 outline-none focus:border-[#FFB347]"
          required
        />

        <div className="flex gap-4">
          <div className="flex flex-col">

            <select
              value={hour}
              onChange={(e) => updateDateTime(date, e.target.value, minute)}
              className="h-11 w-30 rounded-xl border border-[#f0d8bd] bg-white px-3 py-2 text-center text-lg font-semibold outline-none focus:border-[#FFB347]"
              required
            >
              {Array.from({ length: 24 }, (_, i) => {
                const value = String(i).padStart(2, "0");

                return (
                  <option key={value} value={value}>
                    {value} h
                  </option>
                );
              })}
            </select>
          </div>

          <div className="flex flex-col">

            <select
              value={minute}
              onChange={(e) => updateDateTime(date, hour, e.target.value)}
              className="h-11 w-30 rounded-xl border border-[#f0d8bd] bg-white px-3 py-2 text-center text-lg font-semibold outline-none focus:border-[#FFB347]"
              required
            >
              {Array.from({ length: 60 }, (_, i) => {
                const value = String(i).padStart(2, "0");

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

export function CreateFRAPage({ account }: { account: UserAccountDTO }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");

  const minDate = getCurrentDate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!startDate || !endDate) {
      setMessage("Start date and end date are required.");
      return;
    }

    if (endDate <= startDate) {
      setMessage("End date must be later than start date.");
      return;
    }

    try {
      await createFRAAction({
        userId: account.userId,
        categoryId,
        title,
        description,
        targetAmount: Number(targetAmount),
        startDate,
        endDate,
      });

      setMessage("FRA created successfully.");

      setTitle("");
      setDescription("");
      setCategoryId("");
      setTargetAmount("");
      setStartDate("");
      setEndDate("");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to create FRA.",
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

        <h1 className="mt-2 text-3xl font-bold">Create FRA</h1>

        <p className="mt-2 text-[#6f6258]">
          Create a new fundraising activity.
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
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2 w-full rounded-md border border-[#f0d8bd] px-4 py-3 outline-none focus:border-[#FFB347]"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-2 min-h-[120px] w-full rounded-md border border-[#f0d8bd] px-4 py-3 outline-none focus:border-[#FFB347]"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Category ID</label>
              <input
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-2 w-full rounded-md border border-[#f0d8bd] px-4 py-3 outline-none focus:border-[#FFB347]"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Target Amount</label>
              <input
                type="number"
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                className="mt-2 w-full rounded-md border border-[#f0d8bd] px-4 py-3 outline-none focus:border-[#FFB347]"
                required
              />
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <DateTimeInput
                label="Start Date"
                value={startDate}
                minDate={minDate}
                onChange={(value) => {
                  setStartDate(value);

                  if (endDate && endDate <= value) {
                    setEndDate("");
                  }
                }}
              />

              <DateTimeInput
                label="End Date"
                value={endDate}
                minDate={(startDate || minDate).slice(0, 10)}
                onChange={setEndDate}
              />
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
              Create FRA
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