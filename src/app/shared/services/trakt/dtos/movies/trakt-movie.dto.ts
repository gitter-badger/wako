export interface TraktMovieDto {
  title: string;
  year: number;
  ids: {
    trakt: number;
    slug: string;
    imdb: string;
    tmdb: number;
  };
  tagline: string;
  overview: string;
  released: string;
  runtime: number;
  trailer: string;
  homepage: string;
  rating: number;
  votes: number;
  language: string;
  genres: string[];
  certification: any;
}
