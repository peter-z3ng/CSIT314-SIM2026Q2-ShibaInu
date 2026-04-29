import {
  UserAccount,
  type AccountRole,
  type PublicProfileType,
  type UserAccountInput,
} from "@/entity/UserAccount";

type StoredUserAccount = UserAccountInput & {
  id: string;
};

const STORAGE_KEY = "shibainu-auth-users";

export type EmailLookupResult =
  | { status: "existing"; account: UserAccount }
  | { status: "new"; email: string };

export class AuthController {
  private accounts: UserAccount[];

  constructor(initialAccounts?: UserAccount[]) {
    this.accounts = initialAccounts ?? this.loadAccounts();
  }

  findPublicAccountByEmail(email: string): EmailLookupResult {
    const normalizedEmail = this.normalizeEmail(email);
    const account = this.accounts.find((user) => user.email === normalizedEmail);

    if (!account) {
      return { status: "new", email: normalizedEmail };
    }

    if (account.role === "admin") {
      throw new Error("This account cannot use the public login page.");
    }

    return { status: "existing", account };
  }

  signInPublicUser(email: string, password: string) {
    const account = this.requireAccount(email);

    if (account.role === "admin") {
      throw new Error("Admin accounts must use the admin sign in page.");
    }

    this.verifyPassword(account, password);
    return account;
  }

  signInAdmin(email: string, password: string) {
    const account = this.requireAccount(email);

    if (account.role !== "admin") {
      throw new Error("Only admin accounts can access this page.");
    }

    this.verifyPassword(account, password);
    return account;
  }

  signUpPublicUser(input: Omit<UserAccountInput, "role"> & { role: PublicProfileType }) {
    const normalizedEmail = this.normalizeEmail(input.email);
    const existingAccount = this.accounts.find((account) => account.email === normalizedEmail);

    if (existingAccount) {
      throw new Error("An account already exists for this email.");
    }

    const account = new UserAccount({ ...input, email: normalizedEmail });
    this.accounts = [account, ...this.accounts];
    this.saveAccounts();
    return account;
  }

  getDashboardPath(role: AccountRole) {
    if (role === "admin") {
      return "/admin/dashboard";
    }

    return `/dashboard/${role}`;
  }

  private requireAccount(email: string) {
    const normalizedEmail = this.normalizeEmail(email);
    const account = this.accounts.find((user) => user.email === normalizedEmail);

    if (!account) {
      throw new Error("No account was found for this email.");
    }

    return account;
  }

  private verifyPassword(account: UserAccount, password: string) {
    if (account.password !== password) {
      throw new Error("Incorrect password.");
    }
  }

  private normalizeEmail(email: string) {
    const normalizedEmail = email.trim().toLowerCase();

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      throw new Error("Enter a valid email address.");
    }

    return normalizedEmail;
  }

  private loadAccounts() {
    if (typeof window === "undefined") {
      return seedAccounts;
    }

    const rawAccounts = window.localStorage.getItem(STORAGE_KEY);

    if (!rawAccounts) {
      return seedAccounts;
    }

    try {
      const parsedAccounts = JSON.parse(rawAccounts) as StoredUserAccount[];
      return parsedAccounts.map((account) => new UserAccount(account, account.id));
    } catch {
      return seedAccounts;
    }
  }

  private saveAccounts() {
    if (typeof window === "undefined") {
      return;
    }

    const storedAccounts: StoredUserAccount[] = this.accounts.map((account) => ({
      id: account.id,
      username: account.username,
      email: account.email,
      password: account.password,
      role: account.role,
    }));

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(storedAccounts));
  }
}

const seedAccounts = [
  new UserAccount({
    username: "Admin User",
    email: "admin@shibainu.test",
    password: "admin123",
    role: "admin",
  }),
  new UserAccount({
    username: "Daw Mya",
    email: "donee@shibainu.test",
    password: "donee123",
    role: "donee",
  }),
  new UserAccount({
    username: "Campus Fundraiser",
    email: "fundraiser@shibainu.test",
    password: "fund123",
    role: "fundraiser",
  }),
  new UserAccount({
    username: "Operations Team",
    email: "platform@shibainu.test",
    password: "platform123",
    role: "platform-management",
  }),
];
