"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Header } from "@/components/Header";
import { ViewCompletedFRAPage } from "@/fundraiser/boundary/ViewCompletedFRAPage";
import type { FRADTO } from "@/entity/FRA";
import type { FRACategoryDTO } from "@/entity/FRACategory";
import type { UserAccountDTO } from "@/entity/UserAccount";

// SearchCompletedFRAPage
export function SearchCompletedFRAPage({
  account,
  fraList,
  categoryList = [],
}: {
  account: UserAccountDTO;
  fraList: FRADTO[];
  categoryList?: FRACategoryDTO[];
}) {
  const profilePath = account.profile.profile.toLowerCase().replace(" ", "-");
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("keyword") ?? "");
  const [categoryQuery, setCategoryQuery] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);
  const categoryId = searchParams.get("categoryId") ?? "";
  const startDate = searchParams.get("startDate") ?? "";
  const endDate = searchParams.get("endDate") ?? "";
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const initialDate = startDate ? parseDateValue(startDate) : new Date();
    return new Date(initialDate.getFullYear(), initialDate.getMonth(), 1);
  });
  const selectedCategoryIds = splitFilterValues(categoryId);
  const calendarDays = getCalendarDays(calendarMonth);
  const filteredCategories = categoryList.filter((category) =>
    category.categoryName.toLowerCase().includes(categoryQuery.trim().toLowerCase()),
  );
  const dateRangeLabel =
    startDate && endDate
      ? `${formatDateLabel(startDate)} - ${formatDateLabel(endDate)}`
      : startDate
        ? `${formatDateLabel(startDate)} - Select end`
        : endDate
          ? `Select start - ${formatDateLabel(endDate)}`
          : "";

  function updateSearchParam(name: string, value: string) {
    updateSearchParams({ [name]: value });
  }

  function updateSearchParams(updates: Record<string, string>) {
    const nextParams = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([name, value]) => {
      const normalizedValue = value.trim();

      if (normalizedValue) {
        nextParams.set(name, normalizedValue);
      } else {
        nextParams.delete(name);
      }
    });

    const queryString = nextParams.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }

  function toggleSearchParamValue(name: string, value: string) {
    const selectedValues = splitFilterValues(searchParams.get(name) ?? "");
    const nextValues = selectedValues.includes(value)
      ? selectedValues.filter((selectedValue) => selectedValue !== value)
      : [...selectedValues, value];

    updateSearchParam(name, nextValues.join(","));
  }

  function selectDateRangeValue(dateValue: string) {
    if (!startDate || endDate || dateValue < startDate) {
      updateSearchParams({ startDate: dateValue, endDate: "" });
      return;
    }

    updateSearchParams({ endDate: dateValue });
    setIsDateRangeOpen(false);
  }

  // displayMessage(message)
  const displayMessage = (message: string) => (
    <div className="rounded-2xl border border-[#f0d8bd] bg-white/40 p-6 shadow-sm">
      <p className="text-[#6f6258]">{message}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fffaf5] text-[#1d2520]">
      <Header account={account} />

      <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9b5d12]">
          Fundraiser
        </p>

        <h1 className="mt-2 text-3xl font-bold">Completed FRAs</h1>

        <p className="mt-2 text-[#6f6258]">View your completed fundraising activities.</p>

        <section className="mt-8 grid items-start gap-5 lg:grid-cols-[7fr_3fr]">
          <div className="grid gap-6">
            <div className="rounded-2xl border border-[#f0d8bd] bg-white/40 px-4 py-3 shadow-sm">
              <input
                value={keyword}
                onChange={(event) => {
                  setKeyword(event.target.value);
                  updateSearchParam("keyword", event.target.value);
                }}
                placeholder="Search by title"
                aria-label="Search by title"
                className="h-10 w-full bg-transparent px-2 text-lg outline-none placeholder:text-[#9f9082]"
              />
            </div>

            <section>
              <ViewCompletedFRAPage
                profilePath={profilePath}
                fraList={fraList}
                categoryList={categoryList}
                displayMessage={displayMessage}
              />
            </section>
          </div>

          <aside className="rounded-2xl border border-[#f0d8bd] bg-white/40 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-[#9b5d12]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2 5h20" />
                  <path d="M6 12h12" />
                  <path d="M9 19h6" />
                </svg>
                Filters
              </p>
              <button
                type="button"
                onClick={() => {
                  updateSearchParams({
                    keyword: "",
                    categoryId: "",
                    startDate: "",
                    endDate: "",
                  });
                  setKeyword("");
                  setCategoryQuery("");
                  setIsDateRangeOpen(false);
                }}
                className="rounded-md border border-[#f0d8bd] px-3 py-1.5 text-xs font-bold text-[#9b5d12] transition hover:bg-[#fff2df] hover:text-[#FFB347]"
              >
                Clear all
              </button>
            </div>

            <div className="mt-5 grid gap-5">
              <div className="border-t border-[#f0d8bd] pt-5">
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCategoryOpen((current) => !current)}
                    className="flex flex-1 items-center justify-between gap-3 text-left"
                  >
                    <span className="text-lg font-bold text-[#1d2520]">Category</span>
                    <span className="flex size-8 items-center justify-center rounded-full bg-[#9b5d12] text-sm font-bold text-white">
                      <ChevronIcon isOpen={isCategoryOpen} />
                    </span>
                  </button>
                </div>

                {isCategoryOpen ? (
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        updateSearchParam("categoryId", "");
                        setCategoryQuery("");
                      }}
                      className="text-xs font-semibold text-[#9b5d12] transition hover:text-[#FFB347]"
                    >
                      Clear
                    </button>

                    <input
                      value={categoryQuery}
                      onChange={(event) => setCategoryQuery(event.target.value)}
                      placeholder="Search category"
                      className="mt-4 h-10 w-full rounded-md border border-[#f0d8bd] px-3 text-sm outline-none transition focus:border-[#FFB347] focus:ring-2 focus:ring-[#FFB347]/20"
                    />

                    <div className="mt-4 grid max-h-80 gap-3 overflow-y-auto pr-1">
                      {filteredCategories.map((category) => (
                        <label
                          key={category.categoryId}
                          className="flex items-center gap-3 text-sm font-semibold text-[#6f6258]"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategoryIds.includes(category.categoryId)}
                            onChange={() =>
                              toggleSearchParamValue("categoryId", category.categoryId)
                            }
                            className="size-5 appearance-none rounded border border-[#8a8a8a] bg-white transition checked:border-[#9b5d12] checked:bg-[#9b5d12]"
                          />
                          {category.categoryName}
                        </label>
                      ))}

                      {!filteredCategories.length ? (
                        <p className="text-sm text-[#6f6258]">No categories found.</p>
                      ) : null}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="border-t border-[#f0d8bd] pt-5">
                <button
                  type="button"
                  onClick={() => setIsDateRangeOpen((current) => !current)}
                  className="flex w-full items-center justify-between gap-3 text-left"
                >
                  <span>
                    <span className="text-lg font-bold text-[#1d2520]">Date range</span>
                    {dateRangeLabel ? (
                      <span className="mt-1 block text-sm font-semibold text-[#6f6258]">
                        {dateRangeLabel}
                      </span>
                    ) : null}
                  </span>
                  <span className="flex size-8 items-center justify-center rounded-full bg-[#9b5d12] text-sm font-bold text-white">
                    <ChevronIcon isOpen={isDateRangeOpen} />
                  </span>
                </button>

                {isDateRangeOpen ? (
                  <div className="mt-4 rounded-xl border border-[#f0d8bd] bg-white/40 p-4 shadow-sm">
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            setCalendarMonth(
                              new Date(
                                calendarMonth.getFullYear(),
                                calendarMonth.getMonth() - 1,
                                1,
                              ),
                            )
                          }
                          className="size-9 rounded-md border border-[#f0d8bd] text-sm font-bold text-[#9b5d12] transition hover:bg-[#fff2df]"
                        >
                          {"<"}
                        </button>
                        <p className="text-sm font-bold text-[#1d2520]">
                          {getMonthLabel(calendarMonth)}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            setCalendarMonth(
                              new Date(
                                calendarMonth.getFullYear(),
                                calendarMonth.getMonth() + 1,
                                1,
                              ),
                            )
                          }
                          className="size-9 rounded-md border border-[#f0d8bd] text-sm font-bold text-[#9b5d12] transition hover:bg-[#fff2df]"
                        >
                          {">"}
                        </button>
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold uppercase text-[#9b5d12]">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                          <span key={day}>{day}</span>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((calendarDay) => {
                          const dateValue = toDateValue(calendarDay.date);
                          const isOutsideMonth =
                            calendarDay.date.getMonth() !== calendarMonth.getMonth();
                          const isStart = dateValue === startDate;
                          const isEnd = dateValue === endDate;
                          const isInRange =
                            startDate && endDate && dateValue > startDate && dateValue < endDate;

                          return (
                            <button
                              key={dateValue}
                              type="button"
                              onClick={() => selectDateRangeValue(dateValue)}
                              className={`flex aspect-square items-center justify-center rounded-md text-sm font-semibold transition ${
                                isStart || isEnd
                                  ? "bg-[#FFB347] text-white"
                                  : isInRange
                                    ? "bg-[#fff2df] text-[#9b5d12]"
                                    : isOutsideMonth
                                      ? "text-[#c8b9aa] hover:bg-[#fff7ee]"
                                      : "text-[#1d2520] hover:bg-[#fff2df]"
                              }`}
                            >
                              {calendarDay.date.getDate()}
                            </button>
                          );
                        })}
                      </div>

                      <p className="text-xs font-semibold text-[#6f6258]">
                        {startDate && !endDate
                          ? "Choose an end date."
                          : "Choose a start date, then an end date."}
                      </p>

                      <div className="flex justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            updateSearchParams({ startDate: "", endDate: "" });
                          }}
                          className="h-10 rounded-md border border-[#f0d8bd] px-4 text-sm font-semibold text-[#9b5d12] transition hover:bg-[#fff2df]"
                        >
                          Clear
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsDateRangeOpen(false)}
                          className="h-10 rounded-md bg-[#9b5d12] px-4 text-sm font-semibold text-white transition hover:bg-[#8a510f]"
                        >
                          Done
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}

function formatDateLabel(date: string) {
  const [year, month, day] = date.split("-");

  if (!year || !month || !day) {
    return date;
  }

  return `${day}/${month}/${year}`;
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="size-5"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d={isOpen ? "m4.5 15.75 7.5-7.5 7.5 7.5" : "m19.5 8.25-7.5 7.5-7.5-7.5"}
      />
    </svg>
  );
}

function splitFilterValues(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseDateValue(date: string) {
  const [year, month, day] = date.split("-").map(Number);

  if (!year || !month || !day) {
    return new Date();
  }

  return new Date(year, month - 1, day);
}

function toDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getCalendarDays(monthDate: Date) {
  const firstDayOfMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const calendarStart = new Date(firstDayOfMonth);
  calendarStart.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(calendarStart);
    date.setDate(calendarStart.getDate() + index);

    return { date };
  });
}

function getMonthLabel(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}
