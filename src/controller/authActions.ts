"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AdminController } from "@/controller/AdminController";
import { AuthController, type EmailLookupResult } from "@/controller/AuthController";
import type { UserProfileDTO } from "@/entity/UserProfile";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ActionResult = {
  ok: boolean;
  message: string;
};

export type EmailLookupDTO =
  | { status: "existing"; email: string; profile: UserProfileDTO }
  | { status: "pending"; email: string }
  | { status: "suspended"; email: string }
  | { status: "new"; email: string };

export async function listPublicProfiles(): Promise<UserProfileDTO[]> {
  const profiles = await new AuthController().listPublicProfiles();
  return profiles.map((profile) => profile.toDTO());
}

export async function lookupEmail(email: string): Promise<EmailLookupDTO> {
  const result: EmailLookupResult = await new AuthController().lookupEmail(email);

  if (result.status === "existing") {
    return {
      status: result.status,
      email: result.email,
      profile: result.profile.toDTO(),
    };
  }

  return result;
}

export async function createPendingUserAccount(input: {
  username: string;
  email: string;
  password: string;
  requestedProfileId: string;
}): Promise<ActionResult> {
  const result = await new AuthController().createPendingUserAccount(input);

  if (result.ok) {
    revalidatePath("/admin/dashboard");
  }

  return result;
}

export async function approveUserAccount(formData: FormData) {
  await new AuthController().requireAdmin();
  await new AdminController().approveUserAccount(String(formData.get("userId") ?? ""));
  revalidatePath("/admin/dashboard");
}

export async function suspendUserAccount(formData: FormData) {
  await new AuthController().requireAdmin();
  await new AdminController().suspendUserAccount(String(formData.get("userId") ?? ""));
  revalidatePath("/admin/dashboard");
}

export async function createProfile(formData: FormData) {
  await new AuthController().requireAdmin();
  await new AdminController().createProfile(String(formData.get("name") ?? ""));
  revalidatePath("/admin/dashboard");
  revalidatePath("/login");
}

export async function createUserAccount(formData: FormData) {
  await new AuthController().requireAdmin();
  await new AdminController().createUserAccount({
    username: String(formData.get("username") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    profileId: String(formData.get("profileId") ?? ""),
  });
  revalidatePath("/admin/dashboard");
}

export async function signOutAndRedirect() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
