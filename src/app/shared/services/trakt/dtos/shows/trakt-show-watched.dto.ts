export interface TraktShowWatchedDto {
  show: {
    ids: {
      trakt: number;
      imdb: string;
      tmdb: number;
    };
  };
}
