"use client";

import { useActionState, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { processDonation, type DonateState } from "@/controller/donateActions";

const paymentOptions: Array<{
  label: string;
  logo: ReactNode;
}> = [
  {
    label: "PayNow",
    logo: <PaymentTextLogo text="PayNow" className="text-[#7a2da8]" />,
  },
  {
    label: "Credit or Debit Card",
    logo: <CardLogo />,
  },
  {
    label: "Apple Pay",
    logo: <PaymentTextLogo text="Apple Pay" className="text-[#111111]" />,
  },
  {
    label: "Google Pay",
    logo: <PaymentTextLogo text="G Pay" className="text-[#4285f4]" />,
  },
  {
    label: "Paypal",
    logo: <PaymentTextLogo text="PayPal" className="text-[#003087]" />,
  },
];

export function DonatePage({
  profilePath,
  fra_id,
  fraTitle,
  disabled = false,
  disabledReason = "Donations are not available for this FRA.",
}: {
  profilePath: string;
  fra_id: string;
  fraTitle: string;
  disabled?: boolean;
  disabledReason?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  function closeDonationWindow() {
    setIsOpen(false);
    setFormKey((current) => current + 1);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          if (!disabled) {
            setIsOpen(true);
          }
        }}
        disabled={disabled}
        title={disabled ? disabledReason : undefined}
        className="h-12 rounded-md bg-[#FFB347] px-4 text-sm font-bold text-white transition hover:bg-[#FFBE5C] disabled:cursor-not-allowed disabled:bg-[#d8c7b7] disabled:text-white/80"
      >
        Donate
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 py-8">
          <DonateForm
            key={formKey}
            profilePath={profilePath}
            fra_id={fra_id}
            fraTitle={fraTitle}
            onClose={closeDonationWindow}
          />
        </div>
      ) : null}
    </>
  );
}

function DonateForm({
  profilePath,
  fra_id,
  fraTitle,
  onClose,
}: {
  profilePath: string;
  fra_id: string;
  fraTitle: string;
  onClose: () => void;
}) {
  const initialState: DonateState = {
    ok: true,
    message: "",
    donated: false,
    amount: null,
  };
  const [state, formAction, isPending] = useActionState(processDonation, initialState);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [paymentOption, setPaymentOption] = useState(paymentOptions[0]?.label ?? "PayNow");
  const amountValue = Number(amount);
  const displayedAmount = Number.isFinite(amountValue) && amountValue > 0 ? amountValue : 0;
  const hasError = Boolean(state.message && !state.ok);
  const summary = useMemo(
    () => ({
      amount: displayedAmount.toFixed(2),
      paymentOption,
    }),
    [displayedAmount, paymentOption],
  );

  if (state.donated) {
    return (
      <div className="max-h-[80vh] w-full max-w-lg overflow-hidden rounded-2xl border border-[#f0d8bd] bg-[#fffaf5] shadow-2xl">
        <div className="max-h-[80vh] overflow-y-auto p-8 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#fff2df] text-[#FFB347]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="size-7"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          <h2 className="mt-4 text-2xl font-black text-[#1d2520]">Donation successful</h2>
          <p className="mt-2 text-sm font-semibold text-[#6f6258]">
            Thank you for donating SGD {state.amount?.toFixed(2)} to {fraTitle}.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-6 h-11 w-full rounded-md bg-[#FFB347] px-4 text-sm font-bold text-white transition hover:bg-[#FFBE5C]"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="max-h-[80vh] w-full max-w-xl overflow-hidden rounded-2xl border border-[#f0d8bd] bg-[#fffaf5] shadow-2xl"
    >
      <div className="max-h-[80vh] overflow-y-auto p-8">
        <input type="hidden" name="profilePath" value={profilePath} />
        <input type="hidden" name="fra_id" value={fra_id} />
        <input type="hidden" name="paymentOption" value={paymentOption} />

        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9b5d12]">
              Donate to
            </p>
            <h2 className="mt-2 text-2xl font-black text-[#1d2520]">{fraTitle}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-full border border-[#f0d8bd] text-lg font-bold text-[#9b5d12] transition hover:bg-[#fff2df]"
            aria-label="Close donation form"
          >
            ×
          </button>
        </div>

        <label className="mt-7 block">
          <span className="text-sm font-bold text-[#1d2520]">Amount</span>
          <div className="mt-2 flex h-12 overflow-hidden rounded-md border border-[#f0d8bd] bg-white/60 transition focus-within:border-[#FFB347] focus-within:ring-2 focus-within:ring-[#FFB347]/20">
            <span className="flex h-full items-center border-r border-[#f0d8bd] px-3 text-sm font-bold text-[#9b5d12]">
              SGD
            </span>
            <input
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              required
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0.00"
              className="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
            />
          </div>
        </label>

        <label className="mt-5 block">
          <span className="text-sm font-bold text-[#1d2520]">Message</span>
          <textarea
            name="message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Write a message"
            rows={4}
            className="mt-2 w-full resize-none rounded-md border border-[#f0d8bd] bg-white/60 px-3 py-3 text-sm outline-none transition focus:border-[#FFB347] focus:ring-2 focus:ring-[#FFB347]/20"
          />
        </label>

        <fieldset className="mt-6">
          <legend className="text-sm font-bold text-[#1d2520]">Payment method</legend>
          <div className="mt-3 overflow-hidden rounded-xl border border-[#f0d8bd] bg-white/40">
            {paymentOptions.map((option) => (
              <label
                key={option.label}
                className={`flex min-h-16 items-center gap-4 border-b border-[#f0d8bd] px-4 text-sm font-semibold transition last:border-b-0 ${
                  paymentOption === option.label
                    ? "bg-[#fff2df] text-[#1d2520]"
                    : "bg-white/30 text-[#6f6258] hover:bg-[#fffaf5]"
                }`}
              >
                <input
                  type="radio"
                  name="paymentOptionChoice"
                  checked={paymentOption === option.label}
                  onChange={() => setPaymentOption(option.label)}
                  className="accent-[#FFB347]"
                />
                <span className="flex w-20 items-center justify-center">{option.logo}</span>
                <span className="text-base">{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <section className="mt-6 rounded-xl border border-[#f0d8bd] bg-white/40 p-5">
          <p className="text-sm font-bold text-[#1d2520]">Donation summary</p>
          <div className="mt-3 grid gap-2 text-sm font-semibold text-[#6f6258]">
            <div className="flex items-center justify-between gap-4">
              <span>Amount</span>
              <span>SGD {summary.amount}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Payment method</span>
              <span>{summary.paymentOption}</span>
            </div>
          </div>
        </section>

        {hasError ? (
          <p className="mt-4 rounded-md bg-[#fff2df] px-3 py-2 text-sm font-semibold text-[#9b2f12]">
            {state.message}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="mt-6 h-12 w-full rounded-md bg-[#FFB347] px-4 text-sm font-bold text-white transition hover:bg-[#FFBE5C] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Donating..." : "Donate"}
        </button>
      </div>
    </form>
  );
}

function PaymentTextLogo({ text, className }: { text: string; className: string }) {
  return <span className={`text-sm font-black tracking-tight ${className}`}>{text}</span>;
}

function CardLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 32"
      fill="none"
      className="h-8 w-12 text-[#1d2520]"
      aria-hidden="true"
    >
      <rect x="4" y="6" width="40" height="24" rx="4" stroke="currentColor" strokeWidth="3" />
      <path d="M4 14h40" stroke="currentColor" strokeWidth="3" />
      <path d="M11 23h13" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
