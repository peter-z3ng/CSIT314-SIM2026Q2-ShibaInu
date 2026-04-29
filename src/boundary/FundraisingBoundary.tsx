"use client";

import { FormEvent, useMemo, useState } from "react";
import { FundraisingController } from "@/controller/FundraisingController";

const currency = new Intl.NumberFormat("en-SG", {
  style: "currency",
  currency: "SGD",
  maximumFractionDigits: 0,
});

export function FundraisingBoundary() {
  const controller = useMemo(() => new FundraisingController(), []);
  const [campaigns, setCampaigns] = useState(controller.listCampaigns());
  const [selectedCampaignId, setSelectedCampaignId] = useState(campaigns[0]?.id ?? "");
  const [feedback, setFeedback] = useState("");

  const selectedCampaign =
    campaigns.find((campaign) => campaign.id === selectedCampaignId) ?? campaigns[0];
  const summary = controller.getSummary();

  function refresh(message: string, nextSelectedCampaignId?: string) {
    const updatedCampaigns = controller.listCampaigns();
    setCampaigns([...updatedCampaigns]);
    setSelectedCampaignId(nextSelectedCampaignId ?? updatedCampaigns[0]?.id ?? "");
    setFeedback(message);
  }

  function handleCreateCampaign(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    try {
      const campaign = controller.createCampaign({
        title: String(form.get("title") ?? ""),
        description: String(form.get("description") ?? ""),
        targetAmount: Number(form.get("targetAmount")),
        organizer: String(form.get("organizer") ?? ""),
        category: String(form.get("category") ?? ""),
      });

      event.currentTarget.reset();
      setSelectedCampaignId(campaign.id);
      refresh("Campaign created successfully.", campaign.id);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Unable to create campaign.");
    }
  }

  function handleDonate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!selectedCampaign) {
      setFeedback("Create a campaign before accepting donations.");
      return;
    }

    const form = new FormData(event.currentTarget);

    try {
      controller.donateToCampaign(selectedCampaign.id, {
        donorName: String(form.get("donorName") ?? ""),
        amount: Number(form.get("amount")),
        message: String(form.get("message") ?? ""),
      });

      event.currentTarget.reset();
      refresh("Donation recorded successfully.", selectedCampaign.id);
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Unable to record donation.");
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f7f4] text-[#17211b]">
      <section className="border-b border-[#d8ddd2] bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-8 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="flex flex-col justify-center gap-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#4d6b57]">
              BCE Fundraising System
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight sm:text-5xl">
              Manage campaigns, donors, and fundraising progress in one place.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-[#526057]">
              The user interface is the boundary, campaign rules live in the
              controller, and fundraising data is represented by entity classes.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 rounded-lg border border-[#d8ddd2] bg-[#eef2ea] p-4">
            <SummaryTile label="Raised" value={currency.format(summary.totalRaised)} />
            <SummaryTile label="Target" value={currency.format(summary.totalTarget)} />
            <SummaryTile label="Campaigns" value={String(summary.campaignCount)} />
            <SummaryTile label="Donors" value={String(summary.donorCount)} />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[360px_1fr] lg:px-8">
        <aside className="space-y-6">
          <form
            onSubmit={handleCreateCampaign}
            className="rounded-lg border border-[#d8ddd2] bg-white p-5 shadow-sm"
          >
            <h2 className="text-xl font-semibold">Create Campaign</h2>
            <div className="mt-5 space-y-4">
              <Field label="Campaign title" name="title" placeholder="Medical aid drive" />
              <Field label="Organizer" name="organizer" placeholder="Fundraising team" />
              <Field label="Category" name="category" placeholder="Health" />
              <Field
                label="Target amount"
                name="targetAmount"
                placeholder="5000"
                type="number"
              />
              <label className="block text-sm font-medium text-[#2c362f]">
                Description
                <textarea
                  name="description"
                  className="mt-2 min-h-24 w-full rounded-md border border-[#cbd4c6] px-3 py-2 text-sm outline-none transition focus:border-[#315f46] focus:ring-2 focus:ring-[#315f46]/20"
                  placeholder="What will this campaign fund?"
                />
              </label>
            </div>
            <button className="mt-5 h-11 w-full rounded-md bg-[#315f46] px-4 text-sm font-semibold text-white transition hover:bg-[#244d38]">
              Create Campaign
            </button>
          </form>

          <form
            onSubmit={handleDonate}
            className="rounded-lg border border-[#d8ddd2] bg-white p-5 shadow-sm"
          >
            <h2 className="text-xl font-semibold">Record Donation</h2>
            <div className="mt-5 space-y-4">
              <label className="block text-sm font-medium text-[#2c362f]">
                Campaign
                <select
                  value={selectedCampaign?.id ?? ""}
                  onChange={(event) => setSelectedCampaignId(event.target.value)}
                  className="mt-2 h-11 w-full rounded-md border border-[#cbd4c6] bg-white px-3 text-sm outline-none transition focus:border-[#315f46] focus:ring-2 focus:ring-[#315f46]/20"
                >
                  {campaigns.map((campaign) => (
                    <option key={campaign.id} value={campaign.id}>
                      {campaign.title}
                    </option>
                  ))}
                </select>
              </label>
              <Field label="Donor name" name="donorName" placeholder="Alex Lee" />
              <Field label="Amount" name="amount" placeholder="100" type="number" />
              <Field label="Message" name="message" placeholder="Optional note" />
            </div>
            <button className="mt-5 h-11 w-full rounded-md bg-[#20342a] px-4 text-sm font-semibold text-white transition hover:bg-[#14231b]">
              Add Donation
            </button>
            {feedback ? (
              <p className="mt-4 rounded-md bg-[#eef2ea] px-3 py-2 text-sm text-[#315f46]">
                {feedback}
              </p>
            ) : null}
          </form>
        </aside>

        <div className="space-y-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-bold">Active Campaigns</h2>
              <p className="mt-1 text-sm text-[#526057]">
                Select a campaign to view donor activity and record new support.
              </p>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            {campaigns.map((campaign) => (
              <button
                key={campaign.id}
                onClick={() => setSelectedCampaignId(campaign.id)}
                className={`rounded-lg border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                  selectedCampaign?.id === campaign.id
                    ? "border-[#315f46] ring-2 ring-[#315f46]/20"
                    : "border-[#d8ddd2]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6e7b71]">
                      {campaign.category}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold">{campaign.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#526057]">
                      {campaign.description}
                    </p>
                  </div>
                  <span className="rounded-md bg-[#e1eadf] px-2.5 py-1 text-xs font-semibold text-[#315f46]">
                    {campaign.progressPercentage}%
                  </span>
                </div>
                <div className="mt-5 h-2 rounded-full bg-[#e7ebe3]">
                  <div
                    className="h-2 rounded-full bg-[#d77f3f]"
                    style={{ width: `${campaign.progressPercentage}%` }}
                  />
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="font-semibold">{currency.format(campaign.totalRaised)}</span>
                  <span className="text-[#526057]">
                    of {currency.format(campaign.targetAmount)}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {selectedCampaign ? (
            <section className="rounded-lg border border-[#d8ddd2] bg-white p-5 shadow-sm">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div>
                  <p className="text-sm font-medium text-[#526057]">
                    Organized by {selectedCampaign.organizer}
                  </p>
                  <h2 className="text-2xl font-bold">{selectedCampaign.title}</h2>
                </div>
                <p className="text-sm font-semibold text-[#315f46]">
                  {selectedCampaign.donorCount} donations
                </p>
              </div>
              <div className="mt-5 divide-y divide-[#edf0ea]">
                {selectedCampaign.donations.length ? (
                  selectedCampaign.donations.map((donation) => (
                    <div key={donation.id} className="grid gap-2 py-4 sm:grid-cols-[1fr_auto]">
                      <div>
                        <p className="font-semibold">{donation.donorName}</p>
                        {donation.message ? (
                          <p className="mt-1 text-sm text-[#526057]">{donation.message}</p>
                        ) : null}
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="font-semibold">{currency.format(donation.amount)}</p>
                        <p className="mt-1 text-xs text-[#6e7b71]">
                          {donation.donatedAt.toLocaleDateString("en-SG")}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="py-8 text-sm text-[#526057]">No donations recorded yet.</p>
                )}
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block text-sm font-medium text-[#2c362f]">
      {label}
      <input
        name={name}
        type={type}
        min={type === "number" ? 1 : undefined}
        step={type === "number" ? 1 : undefined}
        className="mt-2 h-11 w-full rounded-md border border-[#cbd4c6] px-3 text-sm outline-none transition focus:border-[#315f46] focus:ring-2 focus:ring-[#315f46]/20"
        placeholder={placeholder}
      />
    </label>
  );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-white p-4">
      <p className="text-sm font-medium text-[#526057]">{label}</p>
      <p className="mt-2 text-2xl font-bold text-[#17211b]">{value}</p>
    </div>
  );
}
