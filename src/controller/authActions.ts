"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { ActivateUserAccountController } from "@/admin/controller/ActivateUserAccountController";
import { CreateUserAccountController } from "@/admin/controller/CreateUserAccountController";
import { SuspendUserAccountController } from "@/admin/controller/SuspendUserAccountController";
import { AdminController } from "@/controller/AdminController";
import { AuthController, type EmailLookupResult } from "@/controller/AuthController";
import { CreateUserAccount } from "@/controller/CreateUserAccount";
import { UpdateUserAccountController } from "@/admin/controller/UpdateUserAccountController";
import type { UserProfileDTO } from "@/entity/UserProfile";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ActionResult = {
  ok: boolean;
  message: string;
};

export type CreateUserAccountState = ActionResult;

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
  await new SuspendUserAccountController().suspendUserAccount(String(formData.get("userId") ?? ""));
  revalidatePath("/admin/dashboard");
}

export async function activateUserAccount(input: { userId: string }): Promise<ActionResult> {
  await new AuthController().requireAdmin();

  try {
    await new ActivateUserAccountController().activateUserAccount(input.userId);
    revalidatePath("/admin/account");

    return {
      ok: true,
      message: "User account activated.",
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "User account could not be activated.",
    };
  }
}

export async function activateUserAccountWithPassword(input: {
  userId: string;
  password: string;
}): Promise<ActionResult> {
  const adminAccount = await new AuthController().requireAdmin();

  try {
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
      throw new Error("Password is incorrect.");
    }

    await new ActivateUserAccountController().activateUserAccount(input.userId);
    revalidatePath("/admin/account");

    return {
      ok: true,
      message: "User account activated.",
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "User account could not be activated.",
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

    await new SuspendUserAccountController().suspendUserAccount(input.userId);
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

export async function createUserAccount(
  previousState: CreateUserAccountState,
  formData: FormData,
): Promise<CreateUserAccountState> {
  try {
    await new AuthController().requireAdmin();
    await new CreateUserAccountController().createUserAccount(
      String(formData.get("username") ?? ""),
      String(formData.get("email") ?? ""),
      String(formData.get("password") ?? ""),
      String(formData.get("profileId") ?? ""),
    );
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/account");

    return {
      ok: true,
      message: "User account created successfully.",
    };
  } catch (error) {
    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : previousState.message || "Unable to create user account.",
    };
  }
}

export async function updateUserAccountDetails(input: {
  userId: string;
  username: string;
  email: string;
}): Promise<ActionResult> {
  await new AuthController().requireAdmin();

  try {
    await new UpdateUserAccountController().updateUserAccount(input);
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
