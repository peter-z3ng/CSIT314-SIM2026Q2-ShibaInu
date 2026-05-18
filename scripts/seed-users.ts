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
const DONEE_PROFILE_ID = "d2c8c138-6573-44d5-9e65-7429d1ea07b2";

const firstNames = [
  "James", "John", "Michael", "David", "Daniel", "William", "Matthew",
  "Joseph", "Andrew", "Ryan", "Ethan", "Noah", "Lucas", "Nathan",
  "Samuel", "Benjamin", "Alexander", "Henry", "Jack", "Leo", "Emma",
  "Olivia", "Sophia", "Mia", "Charlotte", "Amelia", "Harper", "Evelyn",
  "Abigail", "Ella", "Ava", "Lily", "Grace", "Chloe", "Hannah",
];

const lastNames = [
  "Smith", "Johnson", "Brown", "Taylor", "Anderson", "Thomas", "Jackson",
  "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Lee",
  "Walker", "Hall", "Allen", "Young", "King", "Wright",
];

const bios = [
  "Passionate about helping communities.",
  "Believes in making a positive impact.",
  "Dedicated to social causes and support.",
  "Working towards a better future.",
  "Enjoys volunteering and charity work.",
  "Focused on supporting meaningful campaigns.",
  "Loves helping people in need.",
  "Advocate for education and healthcare.",
  "Committed to creating change.",
  "Always ready to support good causes.",
];

const genders = ["Male", "Female", "Prefer not to say"];
const statuses = ["active", "pending", "suspended"];

function randomItem(array: string[]) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateName() {
  return `${randomItem(firstNames)} ${randomItem(lastNames)}`;
}

function generateUsername(fullName: string, number: number) {
  return fullName.toLowerCase().replace(/\s+/g, "") + number;
}

function randomDOB() {
  const start = new Date(1970, 0, 1);
  const end = new Date(2005, 11, 31);

  const dob = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );

  return dob.toISOString().split("T")[0];
}

function randomCreatedAt() {
  const start = new Date(2023, 0, 1);
  const end = new Date();

  const createdAt = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );

  return createdAt.toISOString();
}

async function createAccount(
  email: string,
  username: string,
  fullName: string,
  profileId: string
) {
  const createdAt = randomCreatedAt();

  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password: "Password123!",
      email_confirm: true,
    });

  if (authError) {
    console.error("Auth error:", email, authError.message);
    return;
  }

  const userId = authData.user.id;

  const { error: accountError } = await supabase.from("user_account").insert({
    user_id: userId,
    profile_id: profileId,
    email,
    username,
    full_name: fullName,
    gender: randomItem(genders),
    dob: randomDOB(),
    bio: randomItem(bios),
    status: randomItem(statuses),
    created_at: createdAt,
    updated_at: createdAt,
  });

  if (accountError) {
    console.error("Account error:", email, accountError.message);
    return;
  }

  console.log("Created:", email);
}

async function seedUsers() {
  for (let i = 1; i <= 28; i++) {
    const fullName = generateName();
    const username = `fundraiser_${generateUsername(fullName, i)}`;

    await createAccount(
      `${username}@hopespring.com`,
      username,
      fullName,
      FUNDRAISER_PROFILE_ID
    );
  }

  for (let i = 1; i <= 70; i++) {
    const fullName = generateName();
    const username = `donee_${generateUsername(fullName, i)}`;

    await createAccount(
      `${username}@gmail.com`,
      username,
      fullName,
      DONEE_PROFILE_ID
    );
  }

  console.log("Finished creating 28 fundraisers and 70 donees.");
}

seedUsers();