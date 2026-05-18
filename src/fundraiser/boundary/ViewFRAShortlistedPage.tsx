"use client";

// ViewFRAShortlistedPage
export function ViewFRAShortlistedPage({
  fraId,
  shortlistedCount,
}: {
  fraId: string;
  shortlistedCount: number;
}) {
  // displayFRAShortlistedCount(fraId)
  const displayFRAShortlistedCount = (selectedFraId: string) => {
    if (selectedFraId !== fraId) {
      return null;
    }

    return (
      <div className="rounded-2xl border border-[#f0d8bd] bg-[#fffaf5] p-5">
        <p className="text-sm text-[#6f6258]">Shortlisted</p>
        <h2 className="mt-2 text-xl font-bold">{shortlistedCount}</h2>
      </div>
    );
  };

  return displayFRAShortlistedCount(fraId);
}
