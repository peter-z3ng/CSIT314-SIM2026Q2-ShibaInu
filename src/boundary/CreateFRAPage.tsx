"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import type { UserAccountDTO } from "@/entity/UserAccount";
import { createFRAAction } from "@/controller/CreateFRAActions";

export function CreateFRAPage({
  account,
}: {
  account: UserAccountDTO;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

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

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-semibold">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-2 w-full rounded-md border border-[#f0d8bd] px-4 py-3 outline-none focus:border-[#FFB347]"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-2 w-full rounded-md border border-[#f0d8bd] px-4 py-3 outline-none focus:border-[#FFB347]"
                  required
                />
              </div>
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