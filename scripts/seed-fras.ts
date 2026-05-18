import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing Supabase environment variables.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const FUNDRAISER_PROFILE_ID = "b27437cc-87cf-4928-9338-cf82a07b93c0";

const statuses = [
  ...Array(75).fill("active"),
  ...Array(15).fill("closed"),
  ...Array(10).fill("completed"),
];

const fraSamples = [
  {
    title: "School Supplies for Children",
    description:
      "Help provide books, bags, and stationery for children in need.",
  },
  {
    title: "Emergency Medical Support",
    description:
      "Support urgent medical treatment and hospital expenses.",
  },
  {
    title: "Food Packs for Families",
    description:
      "Provide essential food packs for low-income families.",
  },
  {
    title: "Clean Water Project",
    description:
      "Help provide clean and safe drinking water to communities.",
  },
  {
    title: "Animal Shelter Support",
    description:
      "Support food, medicine, and shelter for rescued animals.",
  },
  {
    title: "Elderly Care Assistance",
    description:
      "Help elderly people with daily needs and medical support.",
  },
  {
    title: "Community Learning Centre",
    description:
      "Support learning materials and equipment for a community centre.",
  },
  {
    title: "Disaster Relief Fund",
    description:
      "Provide emergency aid for people affected by disasters.",
  },
  {
    title: "Mental Health Awareness",
    description:
      "Support counselling, workshops, and awareness programmes.",
  },
  {
    title: "Youth Sports Programme",
    description:
      "Help young people access sports training and equipment.",
  },
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

function randomCreatedAt() {
  return randomDateBetween(new Date(2023, 0, 1), new Date());
}

function randomStartDate(createdAt: Date) {
  const maxStart = new Date(createdAt);
  maxStart.setDate(maxStart.getDate() + 30);

  return randomDateBetween(createdAt, maxStart);
}

function randomEndDate(startDate: Date) {
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + randomAmount(7, 180));
  return endDate;
}

async function getFundraiserIds() {
  const { data, error } = await supabase
    .from("user_account")
    .select("user_id")
    .eq("profile_id", FUNDRAISER_PROFILE_ID);

  if (error) {
    throw new Error(error.message);
  }

  return data.map((item) => item.user_id);
}

async function getCategoryIds() {
  const { data, error } = await supabase
    .from("fra_category")
    .select("category_id");

  if (error) {
    throw new Error(error.message);
  }

  return data.map((item) => item.category_id);
}

async function seedFRAs() {
  const fundraiserIds = await getFundraiserIds();
  const categoryIds = await getCategoryIds();

  if (fundraiserIds.length === 0) {
    throw new Error("No fundraiser users found.");
  }

  if (categoryIds.length === 0) {
    throw new Error("No FRA categories found.");
  }

  const fras = Array.from({ length: 100 }, (_, i) => {
    const sample = randomItem(fraSamples);

    const createdAt = randomCreatedAt();
    const startDate = randomStartDate(createdAt);
    const endDate = randomEndDate(startDate);

    const targetAmount = randomAmount(500, 50000);
    const currentAmount = randomAmount(0, targetAmount + 10000);

    return {
      user_id: randomItem(fundraiserIds),
      category_id: randomItem(categoryIds),

      title: `${sample.title} ${i + 1}`,

      description:
        Math.random() < 0.2 ? null : sample.description,

      target_amount: targetAmount,
      current_amount: currentAmount,

      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),

      status: statuses[i],

      view_count: randomAmount(0, 5000),

      fav_count: 0,

      created_at: createdAt.toISOString(),
      updated_at: createdAt.toISOString(),
    };
  });

  const { error } = await supabase
    .from("fra")
    .insert(fras);

  if (error) {
    console.error("FRA insert error:", error.message);
    return;
  }

  console.log("Finished creating 100 FRAs.");
}

seedFRAs();