export type UserProfileStatus = "active" | "suspended";

export class UserProfile {
  readonly profileId: string;
  readonly profile: string;
  readonly status: UserProfileStatus;

  constructor(profileId: string, profile: string, status: UserProfileStatus = "active") {
    if (!profileId.trim()) {
      throw new Error("Profile id is required.");
    }

    if (!profile.trim()) {
      throw new Error("Profile name is required.");
    }

    this.profileId = profileId;
    this.profile = profile.trim();
    this.status = status;
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

  get isActive() {
    return this.status === "active";
  }

  get path() {
    return this.profile
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  viewUserProfile(user_id: string) {
    if (!user_id.trim()) {
      throw new Error("User id is required.");
    }

    return this;
  }

  updateUserProfile(profile_id: string, profile: string) {
    return this.profileId === profile_id && Boolean(profile.trim());
  }

  suspendUserProfile(profile_id: string) {
    return this.profileId === profile_id && this.status !== "suspended";
  }

  activateUserProfile(profile_id: string) {
    return this.profileId === profile_id && this.status === "suspended";
  }

  deleteUserProfile(profile_id: string) {
    return this.profileId === profile_id;
  }

  toDTO(): UserProfileDTO {
    return {
      profileId: this.profileId,
      profile: this.profile,
      status: this.status,
    };
  }
}

export type Profile = UserProfile;

export type UserProfileDTO = {
  profileId: string;
  profile: string;
  status: UserProfileStatus;
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
