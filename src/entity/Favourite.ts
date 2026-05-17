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

  searchFavourite(user_id: string, keyword: string, category: string, status: string): Favourite[] {
    if (this.user_id !== user_id || !this.fra) {
      return [];
    }

    const normalizedKeyword = keyword.trim().toLowerCase();
    const normalizedCategory = category.trim();
    const normalizedStatus = status.trim().toLowerCase();
    const matchesKeyword =
      !normalizedKeyword ||
      this.fra.title.toLowerCase().includes(normalizedKeyword) ||
      (this.fra.description?.toLowerCase().includes(normalizedKeyword) ?? false);
    const matchesCategory =
      !normalizedCategory ||
      normalizedCategory === "all" ||
      this.fra.categoryId === normalizedCategory;
    const matchesStatus =
      !normalizedStatus ||
      normalizedStatus === "all" ||
      this.fra.status.toLowerCase() === normalizedStatus;

    return matchesKeyword && matchesCategory && matchesStatus ? [this] : [];
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
