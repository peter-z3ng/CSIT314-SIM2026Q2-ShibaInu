import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing Supabase environment variables.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const DONEE_PROFILE_ID = "d2c8c138-6573-44d5-9e65-7429d1ea07b2";

const paymentMethods = ["PayNow", "Apple Pay", "Google Pay", "Card", "PayPal"];

const messages = [
  "Hope this helps.",
  "Happy to support this cause.",
  "Wishing everyone the best.",
  "Small help from me.",
  "Keep going, you are doing great.",
  "Glad to contribute.",
  "Supporting with love and hope.",
  "Hope this makes a difference.",
  "For a meaningful cause.",
  "Stay strong.",
];

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomAmount(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDateBetween(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

function randomPayDate() {
  return randomDateBetween(new Date(2023, 0, 1), new Date()).toISOString();
}

async function getFRAIds() {
  const { data, error } = await supabase.from("fra").select("fra_id");

  if (error) {
    throw new Error(error.message);
  }

  return data.map((item) => item.fra_id);
}

async function getDoneeIds() {
  const { data, error } = await supabase
    .from("user_account")
    .select("user_id")
    .eq("profile_id", DONEE_PROFILE_ID);

  if (error) {
    throw new Error(error.message);
  }

  return data.map((item) => item.user_id);
}

async function seedDonations() {
  const fraIds = await getFRAIds();
  const doneeIds = await getDoneeIds();

  if (fraIds.length === 0) {
    throw new Error("No FRAs found.");
  }

  if (doneeIds.length === 0) {
    throw new Error("No donee users found.");
  }

  const donations = Array.from({ length: 500 }, () => {
    return {
      fra_id: randomItem(fraIds),
      user_id: randomItem(doneeIds),
      amount: randomAmount(5, 1000),
      paydate: randomPayDate(),
      payment_method: randomItem(paymentMethods),
      message: Math.random() < 0.3 ? null : randomItem(messages),
    };
  });

  const { error } = await supabase.from("donation").insert(donations);

  if (error) {
    console.error("Donation insert error:", error.message);
    return;
  }

  console.log("Finished creating 500 donations.");
}

seedDonations();