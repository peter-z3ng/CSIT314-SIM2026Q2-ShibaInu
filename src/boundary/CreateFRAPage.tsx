"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import type { UserAccountDTO } from "@/entity/UserAccount";
import { createFRAAction } from "@/controller/CreateFRAActions";
import type { FRACategoryDTO } from "@/entity/FRACategory";
import Link from "next/link";

export function CreateFRAPage({
  account,
  categoryList,
}: {
  account: UserAccountDTO;
  categoryList: FRACategoryDTO[];
}) {
  const router = useRouter();
  const profilePath = account.profile.profile.toLowerCase().replace(" ", "-");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const [targetAmount, setTargetAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");

  const filteredCategories = useMemo(() => {
    return categoryList.filter((category) =>
      category.categoryName.toLowerCase().includes(categorySearch.toLowerCase()),
    );
  }, [categoryList, categorySearch]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!categoryId) {
      setMessage("Please select a category.");
      return;
    }

    if (!startDate || !endDate) {
      setMessage("Start date and end date are required.");
      return;
    }

    if (new Date(endDate) <= new Date(startDate)) {
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

      router.replace(`/${profilePath}/my-fras?created=true`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to create FRA.");
    }
  }

  return (
    <div className="min-h-screen bg-[#fffaf5] text-[#1d2520]">
      <Header account={account} />

      <main className="mx-auto max-w-3xl px-5 py-8">
        <Link
          href={`/${profilePath}/my-fras`}
          className="text-sm font-semibold text-[#9b5d12] transition hover:text-[#FFB347]"
        >
          ← Back to My FRAs
        </Link>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.16em] text-[#9b5d12]">
          Fundraiser
        </p>

        <h1 className="mt-2 text-3xl font-bold">Create FRA</h1>

        <p className="mt-2 text-[#6f6258]">Create a new fundraising activity.</p>

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

            <div className="relative">
              <label className="text-sm font-semibold">Category</label>

              <button
                type="button"
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                className="mt-2 flex w-full items-center justify-between rounded-md border border-[#f0d8bd] bg-white px-4 py-3 text-left outline-none transition hover:border-[#FFB347]"
              >
                <span>
                  {categoryId
                    ? categoryList.find((category) => category.categoryId === categoryId)
                        ?.categoryName
                    : "Select category"}
                </span>

                <span className="text-sm">▼</span>
              </button>

              {showCategoryDropdown ? (
                <div className="absolute z-50 mt-2 w-full rounded-xl border border-[#f0d8bd] bg-white shadow-lg">
                  <div className="p-3">
                    <input
                      value={categorySearch}
                      onChange={(e) => setCategorySearch(e.target.value)}
                      placeholder="Search category..."
                      className="w-full rounded-md border border-[#f0d8bd] px-3 py-2 outline-none focus:border-[#FFB347]"
                    />
                  </div>

                  <div className="max-h-60 overflow-y-auto">
                    {filteredCategories.map((category) => (
                      <button
                        key={category.categoryId}
                        type="button"
                        onClick={() => {
                          setCategoryId(category.categoryId);
                          setCategorySearch("");
                          setShowCategoryDropdown(false);
                        }}
                        className="flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-[#fff4e8]"
                      >
                        <span className="font-semibold">{category.categoryName}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}
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
                  type="datetime-local"
                  value={startDate}
                  min={new Date().toISOString().slice(0, 16)}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-2 w-full rounded-md border border-[#f0d8bd] px-4 py-3 outline-none focus:border-[#FFB347]"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold">End Date</label>

                <input
                  type="datetime-local"
                  value={endDate}
                  min={startDate || new Date().toISOString().slice(0, 16)}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-2 w-full rounded-md border border-[#f0d8bd] px-4 py-3 outline-none focus:border-[#FFB347]"
                  required
                />
              </div>
            </div>

            {message ? <p className="text-sm font-semibold text-[#9b5d12]">{message}</p> : null}

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
