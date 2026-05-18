import { redirect } from "next/navigation";
import { AuthController } from "@/controller/AuthController";
import { RouteController } from "@/controller/RouteController";
import { SearchDonationHistoryPage } from "@/donee/boundary/SearchDonationHistoryPage";
import { ViewDonationHistoryPage } from "@/donee/boundary/ViewDonationHistoryPage";
import { SearchDonationHistoryController } from "@/donee/controller/SearchDonationHistoryController";
import { SearchFRAController } from "@/donee/controller/SearchFRAController";
import { ViewDonationHistoryController } from "@/donee/controller/ViewDonationHistoryController";

export const dynamic = "force-dynamic";

export default async function DoneeDonationsPage({
  params,
  searchParams,
}: {
  params: Promise<{ profileSlug: string }>;
  searchParams: Promise<{
    keyword?: string;
    categoryId?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
  }>;
}) {
  const { profileSlug } = await params;
  const {
    keyword = "",
    categoryId = "",
    startDate = "",
    endDate = "",
    status = "",
  } = await searchParams;
  const account = await new AuthController().requireProfilePath(profileSlug);

  if (account.profile.profile.toLowerCase() !== "donee") {
    redirect(RouteController.getDashboardPath(account.profile));
  }

  const [donations, allDonations, categories] = await Promise.all([
    new SearchDonationHistoryController().searchDonationHistory(
      account.userId,
      keyword,
      categoryId,
      startDate,
      endDate,
      status,
    ),
    new ViewDonationHistoryController().viewDonationHistory(account.userId),
    new SearchFRAController().listCategories(),
  ]);
  const hasSearchFilters = Boolean(
    keyword.trim() || categoryId.trim() || startDate.trim() || endDate.trim() || status.trim(),
  );

  if (!hasSearchFilters) {
    return (
      <ViewDonationHistoryPage
        account={account.toDTO()}
        donations={allDonations.map((donation) => donation.toDTO())}
        categories={categories}
      />
    );
  }

  return (
    <SearchDonationHistoryPage
      account={account.toDTO()}
      donations={donations.map((donation) => donation.toDTO())}
      totalDonations={allDonations.length}
      categories={categories}
    />
  );
}
