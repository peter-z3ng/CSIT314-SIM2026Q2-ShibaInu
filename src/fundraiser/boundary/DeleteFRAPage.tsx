"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

type DeleteFRAPageProps = {
  fraId: string;
  fraTitle: string;
  userId: string;
  deleteFRAAction: (fraId: string, userId: string) => Promise<boolean>;
  onDeleted: () => void;
};

// DeleteFRAPage
export function DeleteFRAPage({
  fraId,
  fraTitle,
  userId,
  deleteFRAAction,
  onDeleted,
}: DeleteFRAPageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  async function handleDelete() {
    try {
      await deleteFRAAction(fraId, userId);
      onDeleted();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to delete FRA.");
    }
  }

  // displayMessage(message)
  const displayMessage = (message: string) => (
    <p className="mt-4 text-sm font-semibold text-red-600">{message}</p>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsOpen(true);
          setMessage("");
        }}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
      >
        <Trash2 className="h-5 w-5" />
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl">
            <h2 className="text-2xl font-bold text-[#1d2520]">Delete FRA</h2>

            {message ? (
              displayMessage(message)
            ) : (
              <p className="mt-4 text-[#6f6258]">
                Are you sure you want to delete <span className="font-semibold">{fraTitle}</span>?
              </p>
            )}

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setMessage("");
                }}
                className="rounded-xl border border-[#f0d8bd] bg-white px-5 py-3 text-sm font-bold text-[#9b5d12] transition hover:bg-[#fff2df]"
              >
                Cancel
              </button>

              {!message ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-xl bg-red-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-red-600"
                >
                  Delete
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
