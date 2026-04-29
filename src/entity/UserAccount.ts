export type PublicProfileType = "donee" | "fundraiser" | "platform-management";
export type AccountRole = PublicProfileType | "admin";

export type UserAccountInput = {
  username: string;
  email: string;
  password: string;
  role: AccountRole;
};

const roleLabels: Record<AccountRole, string> = {
  admin: "Admin",
  donee: "Donee",
  fundraiser: "Fundraiser",
  "platform-management": "Platform Management",
};

export class UserAccount {
  readonly id: string;
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly role: AccountRole;

  constructor(input: UserAccountInput, id = crypto.randomUUID()) {
    if (!input.username.trim()) {
      throw new Error("Username is required.");
    }

    if (!/^\S+@\S+\.\S+$/.test(input.email.trim())) {
      throw new Error("Enter a valid email address.");
    }

    if (input.password.length < 6) {
      throw new Error("Password must be at least 6 characters.");
    }

    this.id = id;
    this.username = input.username.trim();
    this.email = input.email.trim().toLowerCase();
    this.password = input.password;
    this.role = input.role;
  }

  get roleLabel() {
    return roleLabels[this.role];
  }
}

export const publicProfileOptions: Array<{
  label: string;
  value: PublicProfileType;
}> = [
  { label: "Donee", value: "donee" },
  { label: "Fundraiser", value: "fundraiser" },
  { label: "Platform Management", value: "platform-management" },
];

export function getRoleLabel(role: AccountRole) {
  return roleLabels[role];
}
