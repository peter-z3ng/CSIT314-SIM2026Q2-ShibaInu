import type { Profile } from "./Profile";

export type RegistrationRequestStatus = "pending" | "approved" | "rejected";

export type RegistrationRequestInput = {
  username: string;
  email: string;
  requestedProfileId: string;
};

export type RegistrationRequestRecord = {
  id: string;
  username: string;
  email: string;
  requestedProfile: Profile;
  status: RegistrationRequestStatus;
  createdAt: string;
};

export class RegistrationRequest {
  readonly username: string;
  readonly email: string;
  readonly requestedProfileId: string;

  constructor(input: RegistrationRequestInput) {
    if (!input.username.trim()) {
      throw new Error("Username is required.");
    }

    if (!/^\S+@\S+\.\S+$/.test(input.email.trim())) {
      throw new Error("Enter a valid email address.");
    }

    if (!input.requestedProfileId) {
      throw new Error("Select a profile.");
    }

    this.username = input.username.trim();
    this.email = input.email.trim().toLowerCase();
    this.requestedProfileId = input.requestedProfileId;
  }
}
