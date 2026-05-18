"use client";

import { UserAccount } from "@/entity/UserAccount";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

// LoginController
export class LoginController {
  // login(string email, string password)
  async login(email: string, password: string): Promise<boolean> {
    UserAccount.login(email, password);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: UserAccount.normalizeEmail(email),
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }
}
