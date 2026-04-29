"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { RegistrationRequest } from "@/entity/RegistrationRequest";
import type { Profile } from "@/entity/Profile";
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

  const { data: account, error: accountError } = await supabase
    .from("user_account")
    .select("email, profile:user_profile(profile_id, profile)")
    .eq("email", normalizedEmail)
    .maybeSingle<{ email: string; profile: ProfileRow }>();

  if (accountError) {
    throw new Error(accountError.message);
  }

  if (account) {
    return {
      status: "existing",
      email: normalizedEmail,
      profile: mapProfileRow(account.profile),
    };
  }

  const { data: request, error: requestError } = await supabase
    .from("registration_requests")
    .select("email, status")
    .eq("email", normalizedEmail)
    .eq("status", "pending")
    .maybeSingle<{ email: string; status: string }>();

  if (requestError) {
    throw new Error(requestError.message);
  }

  if (request) {
    return { status: "pending", email: normalizedEmail };
  }

  return { status: "new", email: normalizedEmail };
}

export async function submitRegistrationRequest(input: {
  username: string;
  email: string;
  requestedProfileId: string;
}): Promise<ActionResult> {
  const request = new RegistrationRequest(input);
  const supabase = createSupabaseAdminClient();

  const existing = await lookupEmail(request.email);

  if (existing.status !== "new") {
    return {
      ok: false,
      message:
        existing.status === "pending"
          ? "A registration request is already pending for this email."
          : "An account already exists for this email.",
    };
  }

  const { data: profile, error: profileError } = await supabase
    .from("user_profile")
    .select("profile_id, profile")
    .eq("profile_id", request.requestedProfileId)
    .single<{ profile_id: string; profile: string }>();

  if (profileError || !profile) {
    return { ok: false, message: profileError?.message ?? "Selected profile was not found." };
  }

  if (profile.profile.toLowerCase() === "admin") {
    return { ok: false, message: "This profile cannot be requested publicly." };
  }

  const { error } = await supabase.from("registration_requests").insert({
    username: request.username,
    email: request.email,
    requested_profile_id: request.requestedProfileId,
    status: "pending",
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin/dashboard");
  return { ok: true, message: "Registration request submitted for admin approval." };
}

export async function approveRegistrationRequest(formData: FormData) {
  await AuthController.requireAdmin();

  const requestId = String(formData.get("requestId") ?? "");
  const temporaryPassword = String(formData.get("temporaryPassword") ?? "");

  if (temporaryPassword.length < 6) {
    throw new Error("Temporary password must be at least 6 characters.");
  }

  const supabase = createSupabaseAdminClient();
  const { data: request, error: requestError } = await supabase
    .from("registration_requests")
    .select("id, username, email, requested_profile_id, status")
    .eq("id", requestId)
    .single<{
      id: string;
      username: string;
      email: string;
      requested_profile_id: string;
      status: string;
    }>();

  if (requestError || !request) {
    throw new Error(requestError?.message ?? "Request was not found.");
  }

  if (request.status !== "pending") {
    throw new Error("Only pending requests can be approved.");
  }

  const { data: createdUser, error: createError } = await supabase.auth.admin.createUser({
    email: request.email,
    password: temporaryPassword,
    email_confirm: true,
    user_metadata: {
      username: request.username,
      profile_id: request.requested_profile_id,
    },
  });

  if (createError || !createdUser.user) {
    throw new Error(createError?.message ?? "Unable to create user account.");
  }

  const { error: accountError } = await supabase.from("user_account").insert({
    user_id: createdUser.user.id,
    username: request.username,
    email: request.email,
    profile_id: request.requested_profile_id,
  });

  if (accountError) {
    await supabase.auth.admin.deleteUser(createdUser.user.id);
    throw new Error(accountError.message);
  }

  const { error: updateError } = await supabase
    .from("registration_requests")
    .update({ status: "approved", reviewed_at: new Date().toISOString() })
    .eq("id", request.id);

  if (updateError) {
    throw new Error(updateError.message);
  }

  revalidatePath("/admin/dashboard");
}

export async function rejectRegistrationRequest(formData: FormData) {
  await AuthController.requireAdmin();

  const requestId = String(formData.get("requestId") ?? "");
  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("registration_requests")
    .update({ status: "rejected", reviewed_at: new Date().toISOString() })
    .eq("id", requestId);

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
