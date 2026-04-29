import { Campaign, type CampaignInput } from "@/entity/Campaign";
import { Donation, type DonationInput } from "@/entity/Donation";

type StoredDonation = DonationInput & {
  id: string;
  donatedAt: string;
};

type StoredCampaign = CampaignInput & {
  id: string;
  donations: StoredDonation[];
};

const STORAGE_KEY = "fundraising-system-campaigns";

export class FundraisingController {
  private campaigns: Campaign[];

  constructor(initialCampaigns?: Campaign[]) {
    this.campaigns = initialCampaigns ?? this.loadCampaigns();
  }

  listCampaigns() {
    return this.campaigns;
  }

  getSummary() {
    return {
      campaignCount: this.campaigns.length,
      totalRaised: this.campaigns.reduce((total, campaign) => total + campaign.totalRaised, 0),
      totalTarget: this.campaigns.reduce((total, campaign) => total + campaign.targetAmount, 0),
      donorCount: this.campaigns.reduce((total, campaign) => total + campaign.donorCount, 0),
    };
  }

  createCampaign(input: CampaignInput) {
    const campaign = new Campaign(input);
    this.campaigns = [campaign, ...this.campaigns];
    this.saveCampaigns();
    return campaign;
  }

  donateToCampaign(campaignId: string, input: DonationInput) {
    let updatedCampaign: Campaign | undefined;

    this.campaigns = this.campaigns.map((campaign) => {
      if (campaign.id !== campaignId) {
        return campaign;
      }

      updatedCampaign = campaign.addDonation(input);
      return updatedCampaign;
    });

    if (!updatedCampaign) {
      throw new Error("Campaign was not found.");
    }

    this.saveCampaigns();
    return updatedCampaign;
  }

  private loadCampaigns() {
    if (typeof window === "undefined") {
      return seedCampaigns;
    }

    const rawCampaigns = window.localStorage.getItem(STORAGE_KEY);

    if (!rawCampaigns) {
      return seedCampaigns;
    }

    try {
      const parsedCampaigns = JSON.parse(rawCampaigns) as StoredCampaign[];

      return parsedCampaigns.map(
        (campaign) =>
          new Campaign(
            campaign,
            campaign.donations.map(
              (donation) =>
                new Donation(donation, new Date(donation.donatedAt), donation.id),
            ),
            campaign.id,
          ),
      );
    } catch {
      return seedCampaigns;
    }
  }

  private saveCampaigns() {
    if (typeof window === "undefined") {
      return;
    }

    const storedCampaigns: StoredCampaign[] = this.campaigns.map((campaign) => ({
      id: campaign.id,
      title: campaign.title,
      description: campaign.description,
      targetAmount: campaign.targetAmount,
      organizer: campaign.organizer,
      category: campaign.category,
      donations: campaign.donations.map((donation) => ({
        id: donation.id,
        donorName: donation.donorName,
        amount: donation.amount,
        message: donation.message,
        donatedAt: donation.donatedAt.toISOString(),
      })),
    }));

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storedCampaigns));
  }
}

const seedCampaigns = [
  new Campaign(
    {
      title: "Student Relief Fund",
      description: "Support students with emergency transport, meals, and study materials.",
      targetAmount: 8000,
      organizer: "UOW Student Council",
      category: "Education",
    },
    [
      new Donation({ donorName: "Ava Tan", amount: 120, message: "Keep going!" }),
      new Donation({ donorName: "Campus Alumni", amount: 650 }),
    ],
  ),
  new Campaign(
    {
      title: "Community Food Drive",
      description: "Fund grocery packs for low-income families in the local area.",
      targetAmount: 12000,
      organizer: "ShibaInu Volunteers",
      category: "Community",
    },
    [
      new Donation({ donorName: "Min Zaw", amount: 300 }),
      new Donation({ donorName: "Grace Lim", amount: 85, message: "Happy to help." }),
    ],
  ),
];
