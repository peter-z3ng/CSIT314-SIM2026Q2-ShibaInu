"use client";

import type { ReactNode } from "react";

type DeleteFRACategoryPageProps = {
  categoryId: string;
  categoryName: string;
  isUsed?: boolean;
  isOpen: boolean;
  onClose: () => void;
  deleteFRACategoryAction: (formData: FormData) => Promise<{ success: boolean; message: string }>;
};

// DeleteFRACategoryPage
export function DeleteFRACategoryPage({
  categoryId,
  categoryName,
  isUsed = false,
  isOpen,
  onClose,
  deleteFRACategoryAction,
}: DeleteFRACategoryPageProps) {
  if (!isOpen) return null;

  // displayMessage(message)
  const displayMessage = (message: ReactNode) => (
    <p className="mt-4 text-sm text-[#5f5148]">{message}</p>
  );

  if (isUsed) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
          <h2 className="text-xl font-bold text-[#0b1f2a]">Failed to Delete</h2>

          {displayMessage(
            <>
              <span className="font-bold">{categoryName}</span> is being used by FRAs.
            </>,
          )}

          <div className="mt-8 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#ead8c4] px-5 py-2 text-sm font-bold text-[#5f5148]"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <h2 className="text-xl font-bold text-[#0b1f2a]">Delete FRA Category</h2>

        {displayMessage(
          <>
            Are you sure you want to delete <span className="font-bold">{categoryName}</span>?
          </>,
        )}

        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-[#ead8c4] px-4 py-2 text-sm font-bold text-[#5f5148]"
          >
            Cancel
          </button>

          <form
            action={async (formData) => {
              const result = await deleteFRACategoryAction(formData);
              const query = result.success
                ? "success=deleted"
                : `error=${encodeURIComponent(result.message)}`;

              window.location.href = `${window.location.pathname}?${query}`;
            }}
          >
            <input type="hidden" name="categoryId" value={categoryId} />

            <button
              type="submit"
              className="rounded-xl bg-red-500 px-4 py-2 text-sm font-bold text-white"
            >
              Delete
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
