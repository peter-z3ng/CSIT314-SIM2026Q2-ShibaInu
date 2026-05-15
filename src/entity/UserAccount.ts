import { type UserProfile, type UserProfileDTO } from "./UserProfile";

export type AccountStatus = "active" | "pending" | "suspended";

export class UserAccount {
  readonly userId: string;
  readonly username: string;
  readonly fullName: string | null;
  readonly email: string;
  readonly status: AccountStatus;
  readonly profile: UserProfile;

  readonly gender: string | null;
  readonly dateOfBirth: string | null;
  readonly bio: string | null;

  constructor(input: {
    userId: string;
    username: string;
    fullName?: string | null;
    email: string;
    status: AccountStatus;
    profile: UserProfile;

    gender?: string | null;
    dateOfBirth?: string | null;
    bio?: string | null;
  }) {
    if (!input.userId.trim()) {
      throw new Error("User id is required.");
    }

    UserAccount.validateUsername(input.username);

    this.userId = input.userId;
    this.username = input.username.trim();
    this.fullName = input.fullName ?? null;
    this.email = UserAccount.normalizeEmail(input.email);
    this.status = input.status;
    this.profile = input.profile;

    this.gender = input.gender ?? null;
    this.dateOfBirth = input.dateOfBirth ?? null;
    this.bio = input.bio ?? null;
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

  static createUserAccount(input: {
    username: string;
    email: string;
    password: string;
  }) {
    const username = input.username.trim();
    const email = UserAccount.normalizeEmail(input.email);

    UserAccount.validateUsername(username);
    UserAccount.validatePassword(input.password);

    return {
      username,
      email,
      password: input.password,
    };
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

  viewUserAccount(userId: string) {
    if (this.userId !== userId) {
      throw new Error("User account details do not match the requested id.");
    }

    return this;
  }

  updateUserAccountDetails(input: {
    username: string;
    fullName?: string | null;
    email: string;
    status: AccountStatus;

    gender?: string | null;
    dateOfBirth?: string | null;
    bio?: string | null;
  }) {
    return new UserAccount({
      userId: this.userId,
      username: input.username,
      fullName: input.fullName,
      email: input.email,
      status: input.status,
      profile: this.profile,

      gender: input.gender,
      dateOfBirth: input.dateOfBirth,
      bio: input.bio,
    });
  }

  toDTO(): UserAccountDTO {
    return {
      userId: this.userId,
      username: this.username,
      fullName: this.fullName,
      email: this.email,
      status: this.status,
      profile: this.profile.toDTO(),

      gender: this.gender,
      dateOfBirth: this.dateOfBirth,
      bio: this.bio,
    };
  }
}

export type UserAccountDTO = {
  userId: string;
  username: string;
  fullName: string | null;
  email: string;
  status: AccountStatus;
  profile: UserProfileDTO;

  gender: string | null;
  dateOfBirth: string | null;
  bio: string | null;
};