"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type UpdateProfileInput = {
  userId: string;
  username: string;
  gender: string;
  dateOfBirth: string;
  bio: string;
};

export async function updateProfileAction(input: UpdateProfileInput) {
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase
    .from("user_account")
    .update({
      username: input.username,
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