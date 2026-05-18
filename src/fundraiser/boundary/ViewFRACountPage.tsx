"use client";

// ViewFRACountPage
export function ViewFRACountPage({ fraId, viewCount }: { fraId: string; viewCount: number }) {
  // displayFRAviewCount(fraId)
  const displayFRAviewCount = (selectedFraId: string) => {
    if (selectedFraId !== fraId) {
      return null;
    }

    return (
      <div className="rounded-2xl border border-[#f0d8bd] bg-[#fffaf5] p-5">
        <p className="text-sm text-[#6f6258]">Views</p>
        <h2 className="mt-2 text-xl font-bold">{viewCount}</h2>
      </div>
    );
  };

  return displayFRAviewCount(fraId);
}
