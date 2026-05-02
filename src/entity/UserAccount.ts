import { type UserProfile, type UserProfileDTO } from "./UserProfile";

export type AccountStatus = "active" | "pending" | "suspended";

export class UserAccount {
  readonly userId: string;
  readonly username: string;
  readonly email: string;
  readonly status: AccountStatus;
  readonly profile: UserProfile;

  constructor(input: {
    userId: string;
    username: string;
    email: string;
    status: AccountStatus;
    profile: UserProfile;
  }) {
    if (!input.userId.trim()) {
      throw new Error("User id is required.");
    }

    UserAccount.validateUsername(input.username);

    this.userId = input.userId;
    this.username = input.username.trim();
    this.email = UserAccount.normalizeEmail(input.email);
    this.status = input.status;
    this.profile = input.profile;
  }

  static validateUsername(username: string) {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      throw new Error("Username is required.");
    }

    if (trimmedUsername.length > 50) {
      throw new Error("Username must be 50 characters or fewer.");
    }
  }

  static validatePassword(password: string) {
    if (password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }
  }

  static normalizeEmail(email: string) {
    const normalizedEmail = email.trim().toLowerCase();

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      throw new Error("Enter a valid email address.");
    }

    return normalizedEmail;
  }

  get isActive() {
    return this.status === "active";
  }

  toDTO(): UserAccountDTO {
    return {
      userId: this.userId,
      username: this.username,
      email: this.email,
      status: this.status,
      profile: this.profile.toDTO(),
    };
  }
}

export type UserAccountDTO = {
  userId: string;
  username: string;
  email: string;
  status: AccountStatus;
  profile: UserProfileDTO;
};
