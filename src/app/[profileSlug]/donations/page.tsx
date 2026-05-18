import { redirect } from "next/navigation";
import { DonationHistoryPage } from "@/boundary/DonationHistoryPage";
import { AuthController } from "@/controller/AuthController";
import { RouteController } from "@/controller/RouteController";
import { SearchFRAController } from "@/donee/controller/SearchFRAController";
import { ViewDonationHistoryController } from "@/controller/ViewDonationHistoryController";

export const dynamic = "force-dynamic";

export default async function DoneeDonationsPage({
  params,
}: {
  params: Promise<{ profileSlug: string }>;
}) {
  const { profileSlug } = await params;
  const account = await new AuthController().requireProfilePath(profileSlug);

  if (account.profile.profile.toLowerCase() !== "donee") {
    redirect(RouteController.getDashboardPath(account.profile));
  }

  const [donations, categories] = await Promise.all([
    new ViewDonationHistoryController().viewDonationHistory(account.userId),
    new SearchFRAController().listCategories(),
  ]);

  return (
    <DonationHistoryPage
      account={account.toDTO()}
      donations={donations.map((donation) => donation.toDTO())}
      categories={categories}
    />
  );
}
