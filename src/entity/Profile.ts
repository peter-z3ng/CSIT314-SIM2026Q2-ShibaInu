export type Profile = {
  profileId: string;
  profile: string;
};

export type UserAccount = {
  userId: string;
  username: string;
  email: string;
  profile: Profile;
};

export function getProfileLabel(profile: Profile) {
  return profile.profile;
}

export function isAdminProfile(profile: Profile) {
  return profile.profile.toLowerCase() === "admin";
}

export function profileToPath(profile: Pick<Profile, "profile">) {
  return profile.profile.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
