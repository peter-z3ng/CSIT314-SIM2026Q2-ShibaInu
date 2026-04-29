import type { RegistrationRequestRecord } from "@/entity/RegistrationRequest";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type RegistrationRequestRow = {
  id: string;
  username: string;
  email: string;
  requested_role: RegistrationRequestRecord["requestedRole"];
  status: RegistrationRequestRecord["status"];
  created_at: string;
};

export class AdminController {
  static async listPendingRegistrationRequests(): Promise<RegistrationRequestRecord[]> {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
      .from("registration_requests")
      .select("id, username, email, requested_role, status, created_at")
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
      requestedRole: request.requested_role,
      status: request.status,
      createdAt: request.created_at,
    }));
  }
}
