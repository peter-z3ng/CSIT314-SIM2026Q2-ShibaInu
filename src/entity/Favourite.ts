export type FavouriteDTO = {
  fav_id: string;
  user_id: string;
  fra_id: string;
};

export class Favourite {
  readonly fav_id: string;
  readonly user_id: string;
  readonly fra_id: string;

  constructor(input: FavouriteDTO) {
    this.fav_id = input.fav_id;
    this.user_id = input.user_id;
    this.fra_id = input.fra_id;
  }

  saveFavourite(user_id: string, fra_id: string): boolean {
    return this.user_id === user_id && this.fra_id === fra_id;
  }

  toDTO(): FavouriteDTO {
    return {
      fav_id: this.fav_id,
      user_id: this.user_id,
      fra_id: this.fra_id,
    };
  }
}
