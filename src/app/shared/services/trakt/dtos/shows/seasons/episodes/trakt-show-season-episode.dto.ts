export interface TraktShowSeasonEpisodeDto {
  number: number;
  title: string;
  ids: {
    trakt: number;
    slug: string;
    imdb: string;
    tmdb: number;
    tvdb: number;
    tvrage: number;
  };
  overview: string;
  first_aired: string;
  network: string;
  rating: number;
  votes: number;
  runtime: number;
}
