"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Header } from "@/components/Header";
import type { FRADTO } from "@/entity/FRA";
import type { FRACategoryDTO } from "@/entity/FRACategory";
import type { UserAccountDTO } from "@/entity/UserAccount";
import { updateFRAAction } from "@/controller/updateFRAActions";

export function UpdateFRAPage({
  account,
  fra,
  categoryList,
}: {
  account: UserAccountDTO;
  fra: FRADTO;
  categoryList: FRACategoryDTO[];
}) {
  const router = useRouter();
  const profilePath = account.profile.profile.toLowerCase().replace(" ", "-");

  const [title, setTitle] = useState(fra.title);
  const [description, setDescription] = useState(fra.description ?? "");
  const [categoryId, setCategoryId] = useState(fra.categoryId);

  const initialDate = fra.endDate ? new Date(fra.endDate) : new Date();
  const [endDate, setEndDate] = useState(formatDateTimeLocal(initialDate));

  const [status, setStatus] = useState(fra.status);
  const [pendingStatus, setPendingStatus] = useState(fra.status);
  const [message, setMessage] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await updateFRAAction({
        fraId: fra.fraId,
        userId: account.userId,
        title,
        description,
        categoryId,
        endDate,
        status,
      });

      router.push(`/${profilePath}/my-fras/${fra.fraId}?updated=true`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to update FRA.");
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

        <div className="mt-8 flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9b5d12]">
              Fundraiser
            </p>
            <h1 className="mt-2 text-3xl font-bold">Update FRA</h1>
            <p className="mt-2 text-[#6f6258]">
              Update your fundraising activity details.
            </p>
          </div>

          <div className="w-48">
            <select
              value={status}
              onChange={(event) => {
                setPendingStatus(event.target.value);
                setShowStatusModal(true);
              }}
              className={`w-full rounded-full border px-4 py-3 text-center text-sm font-bold uppercase tracking-[0.12em] outline-none ${
                status === "completed"
                  ? "border-green-200 bg-green-100 text-green-700"
                  : status === "closed"
                    ? "border-red-200 bg-red-100 text-red-600"
                    : "border-[#f0d8bd] bg-[#fff2df] text-[#c77700]"
              }`}
            >
              <option value="active">Active</option>
              <option value="closed">Closed</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 rounded-2xl border border-[#f0d8bd] bg-white p-6 shadow-sm"
        >
          <div className="space-y-6">
            <div>
              <label className="text-sm font-semibold">Title</label>
              <input
                type="text"
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
                className="mt-2 min-h-[180px] w-full rounded-md border border-[#f0d8bd] px-4 py-3 outline-none focus:border-[#FFB347]"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold">Category</label>
              <select
                value={categoryId}
                onChange={(event) => setCategoryId(event.target.value)}
                className="mt-2 w-full rounded-md border border-[#f0d8bd] px-4 py-3 outline-none focus:border-[#FFB347]"
                required
              >
                {categoryList.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold">End Date</label>

              <input
                type="datetime-local"
                value={endDate}
                min={
                  fra.startDate
                    ? formatDateTimeLocal(new Date(fra.startDate))
                    : new Date().toISOString().slice(0, 16)
                }
                onChange={(event) => setEndDate(event.target.value)}
                className="mt-2 w-full rounded-md border border-[#f0d8bd] px-4 py-3 outline-none focus:border-[#FFB347]"
                required
              />

              {endDate ? (
                <p className="mt-2 text-sm font-medium text-[#6f6258]">
                  Selected Time: {formatDisplayDateTime(endDate)}
                </p>
              ) : null}
            </div>

            {message ? (
              <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">
                {message}
              </p>
            ) : null}

            <button
              type="submit"
              className="rounded-md bg-[#FFB347] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#FFBE5C]"
            >
              Update FRA
            </button>
          </div>
        </form>
      </main>

      {showStatusModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
            <h2 className="text-2xl font-bold text-[#1d2520]">
              Change FRA Status
            </h2>

            <p className="mt-4 text-[#6f6258]">
              Are you sure you want to change the FRA status to &quot;
              <span className="font-bold">{pendingStatus}</span>&quot;?
            </p>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setPendingStatus(status);
                  setShowStatusModal(false);
                }}
                className="rounded-xl border border-[#f0d8bd] bg-white px-5 py-3 text-sm font-bold text-[#9b5d12] transition hover:bg-[#fff2df]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  setStatus(pendingStatus);
                  setShowStatusModal(false);
                }}
                className="rounded-xl bg-[#FFB347] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#FFBE5C]"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function formatDateTimeLocal(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:${minute}`;
}

function formatDisplayDateTime(value: string) {
  return new Date(value).toLocaleString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}