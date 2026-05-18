import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing Supabase environment variables.");
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const USER_ID = "33b5af7a-a83d-4368-97ff-f0a193d39cf2";

const adjectives = [
  "Emergency",
  "Community",
  "Global",
  "Hope",
  "Bright",
  "Future",
  "Rapid",
  "Care",
  "Safe",
  "United",
  "Healing",
  "Support",
  "Kindness",
  "Education",
  "Medical",
  "Green",
  "Animal",
  "Children",
  "Youth",
  "Senior"
];

const nouns = [
  "Relief",
  "Aid",
  "Support",
  "Initiative",
  "Program",
  "Campaign",
  "Mission",
  "Project",
  "Foundation",
  "Fund",
  "Network",
  "Outreach",
  "Care",
  "Recovery",
  "Development",
  "Shelter",
  "Scholarship",
  "Assistance",
  "Services",
  "Action"
];

function randomItem(array: string[]) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateCategoryName(existing: Set<string>) {
  let name = "";

  do {
    name = `${randomItem(adjectives)} ${randomItem(nouns)}`;
  } while (existing.has(name));

  existing.add(name);
  return name;
}

async function seedCategories() {
  const usedNames = new Set<string>();

  const categories = Array.from({ length: 100 }, () => {
    const categoryName = generateCategoryName(usedNames);

    return {
        category_name: categoryName,
        description: `Campaigns related to ${categoryName.toLowerCase()}.`,
        user_id: USER_ID,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        };
  });

  const { error } = await supabase
    .from("fra_category")
    .insert(categories);

  if (error) {
    console.error("Category insert error:", error.message);
    return;
  }

  console.log("Finished creating 100 unique categories.");
}

seedCategories();