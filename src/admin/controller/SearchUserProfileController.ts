import { UserProfile, type UserProfileDTO } from "@/entity/UserProfile";

// SearchUserProfileController
export class SearchUserProfileController {
  private readonly userProfiles: UserProfile[];

  constructor(userProfiles: UserProfileDTO[]) {
    this.userProfiles = userProfiles.map(
      (profile) => new UserProfile(profile.profileId, profile.profile, profile.status),
    );
  }

  // searchUserProfile(...)
  searchUserProfile(keyword: string, profileStatus: string[]): UserProfileDTO[] {
    return this.userProfiles
      .filter((profile) => profile.searchUserProfile(keyword, profileStatus))
      .map((profile) => profile.toDTO());
  }
}
