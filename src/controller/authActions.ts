"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { RegistrationRequest } from "@/entity/RegistrationRequest";
import type { AccountRole, PublicProfileType } from "@/entity/UserAccount";
import { AuthController, type EmailLookupResult } from "@/controller/AuthController";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ActionResult = {
  ok: boolean;
  message: string;
};

export async function lookupEmail(email: string): Promise<EmailLookupResult> {
  const normalizedEmail = normalizeEmail(email);
  const supabase = createSupabaseAdminClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("email, role")
    .eq("email", normalizedEmail)
    .maybeSingle<{ email: string; role: AccountRole }>();

  if (profileError) {
    throw new Error(profileError.message);
  }

  if (profile) {
    return {
      status: "existing",
      email: normalizedEmail,
      role: profile.role,
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
  requestedRole: PublicProfileType;
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

  const { error } = await supabase.from("registration_requests").insert({
    username: request.username,
    email: request.email,
    requested_role: request.requestedRole,
    status: "pending",
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin/dashboard");
  return { ok: true, message: "Registration request submitted for admin approval." };
}

export async function approveRegistrationRequest(formData: FormData) {
  await AuthController.requireRole("admin");

  const requestId = String(formData.get("requestId") ?? "");
  const temporaryPassword = String(formData.get("temporaryPassword") ?? "");

  if (temporaryPassword.length < 6) {
    throw new Error("Temporary password must be at least 6 characters.");
  }

  const supabase = createSupabaseAdminClient();
  const { data: request, error: requestError } = await supabase
    .from("registration_requests")
    .select("id, username, email, requested_role, status")
    .eq("id", requestId)
    .single<{
      id: string;
      username: string;
      email: string;
      requested_role: PublicProfileType;
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
      role: request.requested_role,
    },
  });

  if (createError || !createdUser.user) {
    throw new Error(createError?.message ?? "Unable to create user account.");
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    id: createdUser.user.id,
    username: request.username,
    email: request.email,
    role: request.requested_role,
  });

  if (profileError) {
    await supabase.auth.admin.deleteUser(createdUser.user.id);
    throw new Error(profileError.message);
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
  await AuthController.requireRole("admin");

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

export async function signOutAndRedirect() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}

function normalizeEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
    throw new Error("Enter a valid email address.");
  }

  return normalizedEmail;
}
