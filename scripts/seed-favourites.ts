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

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

async function getDoneeIds() {
  const { data, error } = await supabase
    .from("user_account")
    .select("user_id")
    .eq("profile_id", DONEE_PROFILE_ID);

  if (error) throw new Error(error.message);

  return data.map((item) => item.user_id);
}

async function getFRAIds() {
  const { data, error } = await supabase
    .from("fra")
    .select("fra_id");

  if (error) throw new Error(error.message);

  return data.map((item) => item.fra_id);
}

async function seedFavourites() {
  const doneeIds = await getDoneeIds();
  const fraIds = await getFRAIds();

  if (doneeIds.length === 0) {
    throw new Error("No donee users found.");
  }

  if (fraIds.length === 0) {
    throw new Error("No FRAs found.");
  }

  const uniquePairs = new Set<string>();
  const favourites = [];

  while (favourites.length < 300) {
    const userId = randomItem(doneeIds);
    const fraId = randomItem(fraIds);
    const key = `${userId}-${fraId}`;

    if (!uniquePairs.has(key)) {
      uniquePairs.add(key);

      favourites.push({
        user_id: userId,
        fra_id: fraId,
      });
    }
  }

  const { error } = await supabase
    .from("favourite")
    .insert(favourites);

  if (error) {
    console.error("Favourite insert error:", error.message);
    return;
  }

  console.log("Finished creating 300 favourites.");
}

seedFavourites();