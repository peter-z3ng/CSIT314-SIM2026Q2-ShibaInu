import type { PublicProfileType } from "./UserAccount";

export type RegistrationRequestStatus = "pending" | "approved" | "rejected";

export type RegistrationRequestInput = {
  username: string;
  email: string;
  requestedRole: PublicProfileType;
};

export type RegistrationRequestRecord = RegistrationRequestInput & {
  id: string;
  status: RegistrationRequestStatus;
  createdAt: string;
};

export class RegistrationRequest {
  readonly username: string;
  readonly email: string;
  readonly requestedRole: PublicProfileType;

  constructor(input: RegistrationRequestInput) {
    if (!input.username.trim()) {
      throw new Error("Username is required.");
    }

    if (!/^\S+@\S+\.\S+$/.test(input.email.trim())) {
      throw new Error("Enter a valid email address.");
    }

    this.username = input.username.trim();
    this.email = input.email.trim().toLowerCase();
    this.requestedRole = input.requestedRole;
  }
}
