export interface TraktMoviesWatchedDto {
  movie: {
    ids: {
      trakt: number;
      imdb: string;
      tmdb: number;
    };
  };
}
