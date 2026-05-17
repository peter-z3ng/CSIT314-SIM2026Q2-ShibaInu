import { UserAccount, type UserAccountDTO } from "@/entity/UserAccount";
import { UserProfile } from "@/entity/UserProfile";

// SearchUserAccountController
export class SearchUserAccountController {
  private readonly userAccount: UserAccount;

  constructor(userAccount: UserAccountDTO) {
    this.userAccount = new UserAccount({
      userId: userAccount.userId,
      username: userAccount.username,
      fullName: userAccount.fullName,
      email: userAccount.email,
      status: userAccount.status,
      profile: new UserProfile(userAccount.profile.profileId, userAccount.profile.profile),
      gender: userAccount.gender,
      dateOfBirth: userAccount.dateOfBirth,
      bio: userAccount.bio,
    });
  }

  // searchByUsername(...)
  searchByUsername(username: string): boolean {
    return this.userAccount.searchByUsername(username);
  }
}
