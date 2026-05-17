"use client";

import { useActionState, useState } from "react";
import { processFavourite, type SaveFavouriteState } from "@/controller/saveFavouriteActions";

export function SaveFavouritePage({
  profilePath,
  fra_id,
  isSavedInitially,
}: {
  profilePath: string;
  fra_id: string;
  isSavedInitially: boolean;
}) {
  const initialState: SaveFavouriteState = {
    ok: true,
    message: "",
    saved: isSavedInitially,
  };
  const [state, formAction, isPending] = useActionState(processFavourite, initialState);
  const [isSaved, setIsSaved] = useState(isSavedInitially);
  const [message, setMessage] = useState("");
  const hasError = Boolean(state.message && !state.ok);
  const displayedMessage = hasError ? state.message : message || state.message;
  const isHeartFilled = hasError ? state.saved : isSaved;
  const nextAction = isHeartFilled ? "remove" : "save";

  const displaySavedState = (fra_id: string) => (
    <form
      action={formAction}
      className="relative flex w-10 flex-col items-center"
      onSubmit={() => {
        const nextSavedState = !isHeartFilled;
        setIsSaved(nextSavedState);
        setMessage(nextSavedState ? "Saved" : "");
      }}
    >
      <input type="hidden" name="profilePath" value={profilePath} />
      <input type="hidden" name="fra_id" value={fra_id} />
      <input type="hidden" name="favouriteAction" value={nextAction} />
      <button
        type="submit"
        aria-label={isHeartFilled ? "FRA saved as favourite" : "Save FRA as favourite"}
        disabled={isPending}
        className={`flex size-10 items-center justify-center rounded-full border transition disabled:cursor-not-allowed disabled:opacity-70 ${
          isHeartFilled
            ? "border-[#FFB347] bg-[#fff2df] text-[#FFB347]"
            : "border-[#f0d8bd] bg-[#fffaf5] text-[#9b5d12] hover:border-[#FFB347] hover:bg-[#fff2df] hover:text-[#FFB347]"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill={isHeartFilled ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.8"
          className="size-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.936 0-3.6 1.126-4.312 2.733C11.288 4.876 9.624 3.75 7.688 3.75 5.099 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
          />
        </svg>
      </button>
      {displayedMessage ? (
        <p
          role="status"
          className={`absolute left-1/2 top-12 -translate-x-1/2 whitespace-nowrap rounded-md px-3 py-2 text-xs font-semibold shadow-sm ${
            hasError ? "bg-[#fff2df] text-[#9b2f12]" : "bg-[#fff2df] text-[#9b5d12]"
          }`}
        >
          {displayedMessage}
        </p>
      ) : null}
    </form>
  );

  return displaySavedState(fra_id);
}
