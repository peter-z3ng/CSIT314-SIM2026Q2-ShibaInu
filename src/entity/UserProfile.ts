export class UserProfile {
  readonly profileId: string;
  readonly profile: string;

  constructor(profileId: string, profile: string) {
    if (!profileId.trim()) {
      throw new Error("Profile id is required.");
    }

    if (!profile.trim()) {
      throw new Error("Profile name is required.");
    }

    this.profileId = profileId;
    this.profile = profile.trim();
  }

  static createNew(profile: string) {
    if (!profile.trim()) {
      throw new Error("Profile name is required.");
    }

    return profile.trim();
  }

  get label() {
    return this.profile;
  }

  get isAdmin() {
    return this.profile.toLowerCase() === "admin";
  }

  get path() {
    return this.profile
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  toDTO(): UserProfileDTO {
    return {
      profileId: this.profileId,
      profile: this.profile,
    };
  }
}

export type Profile = UserProfile;

export type UserProfileDTO = {
  profileId: string;
  profile: string;
};

export function getProfileLabel(profile: UserProfile) {
  return profile.label;
}

export function isAdminProfile(profile: UserProfile) {
  return profile.isAdmin;
}

export function profileToPath(profile: Pick<UserProfile, "profile">) {
  return new UserProfile("route-profile", profile.profile).path;
}
