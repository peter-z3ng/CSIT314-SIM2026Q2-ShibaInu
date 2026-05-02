"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Profile, UserAccount } from "@/entity/Profile";
import { AuthController, type EmailLookupResult } from "@/controller/AuthController";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ActionResult = {
  ok: boolean;
  message: string;
};

type ProfileRow = {
  profile_id: string;
  profile: string;
};

type AccountLookupRow = {
  email: string;
  status: UserAccount["status"];
  profile: ProfileRow;
};

export async function listPublicProfiles(): Promise<Profile[]> {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("user_profile")
    .select("profile_id, profile")
    .neq("profile", "Admin")
    .order("profile", { ascending: true })
    .returns<ProfileRow[]>();

  if (error) {
    throw new Error(error.message);
  }

  return data.map(mapProfileRow);
}

export async function lookupEmail(email: string): Promise<EmailLookupResult> {
  const normalizedEmail = normalizeEmail(email);
  const supabase = createSupabaseAdminClient();

  const { data: account, error } = await supabase
    .from("user_account")
    .select("email, status, profile:user_profile(profile_id, profile)")
    .eq("email", normalizedEmail)
    .maybeSingle<AccountLookupRow>();

  if (error) {
    throw new Error(error.message);
  }

  if (!account) {
    return { status: "new", email: normalizedEmail };
  }

  if (account.status === "pending") {
    return { status: "pending", email: normalizedEmail };
  }

  if (account.status === "suspended") {
    return { status: "suspended", email: normalizedEmail };
  }

  return {
    status: "existing",
    email: normalizedEmail,
    profile: mapProfileRow(account.profile),
  };
}

export async function createPendingUserAccount(input: {
  username: string;
  email: string;
  password: string;
  requestedProfileId: string;
}): Promise<ActionResult> {
  const username = input.username.trim();
  const email = normalizeEmail(input.email);

  if (!username) {
    return { ok: false, message: "Username is required." };
  }

  if (input.password.length < 6) {
    return { ok: false, message: "Password must be at least 6 characters." };
  }

  if (!input.requestedProfileId) {
    return { ok: false, message: "Select a profile." };
  }

  const existing = await lookupEmail(email);

  if (existing.status !== "new") {
    return {
      ok: false,
      message:
        existing.status === "pending"
          ? "Your account is waiting for admin approval."
          : "An account already exists for this email.",
    };
  }

  const supabase = createSupabaseAdminClient();
  const { data: profile, error: profileError } = await supabase
    .from("user_profile")
    .select("profile_id, profile")
    .eq("profile_id", input.requestedProfileId)
    .single<ProfileRow>();

  if (profileError || !profile) {
    return { ok: false, message: profileError?.message ?? "Selected profile was not found." };
  }

  if (profile.profile.toLowerCase() === "admin") {
    return { ok: false, message: "Admin accounts cannot be requested publicly." };
  }

  const { data: createdUser, error: createError } = await supabase.auth.admin.createUser({
    email,
    password: input.password,
    email_confirm: true,
    user_metadata: {
      username,
      profile_id: input.requestedProfileId,
    },
  });

  if (createError || !createdUser.user) {
    return { ok: false, message: createError?.message ?? "Unable to create account." };
  }

  const { error: accountError } = await supabase.from("user_account").insert({
    user_id: createdUser.user.id,
    username,
    email,
    profile_id: input.requestedProfileId,
    status: "pending",
  });

  if (accountError) {
    await supabase.auth.admin.deleteUser(createdUser.user.id);
    return { ok: false, message: accountError.message };
  }

  revalidatePath("/admin/dashboard");
  return { ok: true, message: "Account created and waiting for admin approval." };
}

export async function approveUserAccount(formData: FormData) {
  await AuthController.requireAdmin();

  const userId = String(formData.get("userId") ?? "");
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("user_account")
    .update({ status: "active", updated_at: new Date().toISOString() })
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/dashboard");
}

export async function suspendUserAccount(formData: FormData) {
  await AuthController.requireAdmin();

  const userId = String(formData.get("userId") ?? "");
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("user_account")
    .update({ status: "suspended", updated_at: new Date().toISOString() })
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/dashboard");
}

export async function createProfile(formData: FormData) {
  await AuthController.requireAdmin();

  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    throw new Error("Profile name is required.");
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("user_profile").insert({
    profile: name,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/dashboard");
  revalidatePath("/login");
}

export async function signOutAndRedirect() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}

function mapProfileRow(row: ProfileRow): Profile {
  return {
    profileId: row.profile_id,
    profile: row.profile,
  };
}

function normalizeEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
    throw new Error("Enter a valid email address.");
  }

  return normalizedEmail;
}
