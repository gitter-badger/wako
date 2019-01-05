export interface TraktShowDto {
  title: string;
  year: number;
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
  runtime: number;
  rating: number;
  votes: number;
  language: string;
  genres: string[];
  certification: any;
  aired_episodes: number;
}
