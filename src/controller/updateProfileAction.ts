"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type UpdateProfileInput = {
  userId: string;
  username: string;
  fullName: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  bio: string;
};

export async function updateProfileAction(input: UpdateProfileInput) {
  const supabase = createSupabaseAdminClient();

  const username = input.username.trim();
  const fullName = input.fullName.trim();
  const email = input.email.trim().toLowerCase();

  if (!username) {
    throw new Error("Username is required.");
  }

  if (!email) {
    throw new Error("Email is required.");
  }

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    throw new Error("Enter a valid email address.");
  }

  const { data: sameUsername, error: usernameError } = await supabase
    .from("user_account")
    .select("user_id")
    .eq("username", username)
    .neq("user_id", input.userId)
    .maybeSingle();

  if (usernameError) {
    throw new Error(usernameError.message);
  }

  if (sameUsername) {
    throw new Error("Already taken.");
  }

  const { data: sameEmail, error: emailError } = await supabase
    .from("user_account")
    .select("user_id")
    .eq("email", email)
    .neq("user_id", input.userId)
    .maybeSingle();

  if (emailError) {
    throw new Error(emailError.message);
  }

  if (sameEmail) {
    throw new Error("Already taken.");
  }

  const { error: authError } = await supabase.auth.admin.updateUserById(input.userId, {
    email,
  });

  if (authError) {
    throw new Error(authError.message);
  }

  const { error } = await supabase
    .from("user_account")
    .update({
      username,
      full_name: fullName || null,
      email,
      gender: input.gender || null,
      dob: input.dateOfBirth || null,
      bio: input.bio || null,
    })
    .eq("user_id", input.userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  return true;
}
