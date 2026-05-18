import { FRA, type FRADTO } from "@/entity/FRA";

export type FavouriteDTO = {
  fav_id: string;
  user_id: string;
  fra_id: string;
  fra: FRADTO | null;
};

export class Favourite {
  readonly fav_id: string;
  readonly user_id: string;
  readonly fra_id: string;
  readonly fra: FRA | null;

  constructor(input: { fav_id: string; user_id: string; fra_id: string; fra?: FRA | null }) {
    this.fav_id = input.fav_id;
    this.user_id = input.user_id;
    this.fra_id = input.fra_id;
    this.fra = input.fra ?? null;
  }

  saveFavourite(user_id: string, fra_id: string): boolean {
    return this.user_id === user_id && this.fra_id === fra_id;
  }

  // searchFavourite(user_id, keyword, category, status)
  static searchFavourite(
    favourites: Favourite[],
    user_id: string,
    keyword: string,
    category: string,
    status: string,
    startDate: string = "",
    endDate: string = "",
  ): Favourite[] {
    const normalizedKeyword = keyword.trim().toLowerCase();
    const categoryIds = splitFilterValues(category);
    const statuses = splitFilterValues(status).map((item) => item.toLowerCase());

    return favourites.filter((favourite) => {
      if (favourite.user_id !== user_id || !favourite.fra) {
        return false;
      }

      const matchesKeyword =
        !normalizedKeyword ||
        favourite.fra.title.toLowerCase().includes(normalizedKeyword) ||
        (favourite.fra.description?.toLowerCase().includes(normalizedKeyword) ?? false);
      const matchesCategory =
        !categoryIds.length || categoryIds.includes(favourite.fra.categoryId);
      const matchesStatus =
        !statuses.length || statuses.includes(favourite.fra.status.toLowerCase());
      const matchesStartDate = !startDate || favourite.fra.startDate >= startDate;
      const matchesEndDate =
        !endDate || (favourite.fra.endDate ?? favourite.fra.startDate) <= endDate;

      return matchesKeyword && matchesCategory && matchesStatus && matchesStartDate && matchesEndDate;
    });
  }

  toDTO(): FavouriteDTO {
    return {
      fav_id: this.fav_id,
      user_id: this.user_id,
      fra_id: this.fra_id,
      fra: this.fra?.toDTO() ?? null,
    };
  }
}

function splitFilterValues(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item && item !== "all");
}
