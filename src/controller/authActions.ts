"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { CreateUserAccountController } from "@/admin/CreateUserAccountController";
import { AdminController } from "@/controller/AdminController";
import { AuthController, type EmailLookupResult } from "@/controller/AuthController";
import { CreateUserAccount } from "@/controller/CreateUserAccount";
import { ViewUserAccountController } from "@/controller/ViewUserAccountController";
import type { AccountStatus } from "@/entity/UserAccount";
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
  await new CreateUserAccount().approvePendingAccount(String(formData.get("userId") ?? ""));
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/account");
}

export async function suspendUserAccount(formData: FormData) {
  await new AuthController().requireAdmin();
  await new AdminController().suspendUserAccount(String(formData.get("userId") ?? ""));
  revalidatePath("/admin/dashboard");
}

export async function suspendUserAccountsByProfile(input: {
  profileId: string;
  suspendReason: string;
}): Promise<ActionResult> {
  await new AuthController().requireAdmin();

  try {
    await new AdminController().suspendUserAccount(
      input.profileId,
      input.suspendReason,
    );
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/account");
    revalidatePath("/admin/profile");

    return {
      ok: true,
      message: "User accounts suspended.",
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "User accounts could not be suspended.",
    };
  }
}

export async function suspendUserAccountWithPassword(input: {
  userId: string;
  password: string;
}): Promise<ActionResult> {
  const adminAccount = await new AuthController().requireAdmin();

  try {
    if (input.userId === adminAccount.userId) {
      throw new Error("You cannot suspend your own account.");
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Supabase public environment variables are not configured.");
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const { error } = await supabase.auth.signInWithPassword({
      email: adminAccount.email,
      password: input.password,
    });

    if (error) {
      throw new Error("Admin password is incorrect.");
    }

    await new AdminController().suspendUserAccount(input.userId);
    revalidatePath("/admin/account");

    return {
      ok: true,
      message: "User account suspended.",
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "User account could not be suspended.",
    };
  }
}

export async function createProfile(formData: FormData) {
  await new AuthController().requireAdmin();
  await new AdminController().createProfile(String(formData.get("name") ?? ""));
  revalidatePath("/admin/dashboard");
  revalidatePath("/login");
}

export async function createUserAccount(formData: FormData) {
  await new AuthController().requireAdmin();
  await new CreateUserAccountController().createUserAccount({
    username: String(formData.get("username") ?? ""),
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
    profileId: String(formData.get("profileId") ?? ""),
  });
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/account");
}

export async function updateUserAccountDetails(input: {
  userId: string;
  username: string;
  email: string;
  status: AccountStatus;
}): Promise<ActionResult> {
  await new AuthController().requireAdmin();

  try {
    await new ViewUserAccountController().updateUserAccountDetails(input);
    revalidatePath("/admin/account");

    return {
      ok: true,
      message: "User account updated.",
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "User account could not be updated.",
    };
  }
}

export async function signOutAndRedirect() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
