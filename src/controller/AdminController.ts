import type { Profile } from "@/entity/Profile";
import type { RegistrationRequestRecord } from "@/entity/RegistrationRequest";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type RegistrationRequestRow = {
  id: string;
  username: string;
  email: string;
  requested_profile: {
    profile_id: string;
    profile: string;
  };
  status: RegistrationRequestRecord["status"];
  created_at: string;
};

export class AdminController {
  static async listProfiles(): Promise<Profile[]> {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("user_profile")
      .select("profile_id, profile")
      .order("profile", { ascending: true })
      .returns<RegistrationRequestRow["requested_profile"][]>();

    if (error) {
      throw new Error(error.message);
    }

    return data.map(mapProfile);
  }

  static async listPendingRegistrationRequests(): Promise<RegistrationRequestRecord[]> {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("registration_requests")
      .select(
        "id, username, email, requested_profile:user_profile(profile_id, profile), status, created_at",
      )
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .returns<RegistrationRequestRow[]>();

    if (error) {
      throw new Error(error.message);
    }

    return data.map((request) => ({
      id: request.id,
      username: request.username,
      email: request.email,
      requestedProfile: mapProfile(request.requested_profile),
      status: request.status,
      createdAt: request.created_at,
    }));
  }
}

function mapProfile(profile: RegistrationRequestRow["requested_profile"]): Profile {
  return {
    profileId: profile.profile_id,
    profile: profile.profile,
  };
}
