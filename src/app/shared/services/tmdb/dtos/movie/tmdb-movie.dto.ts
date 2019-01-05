export interface TmdbMovieDto {
  adult: boolean;
  backdrop_path: string;
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  release_date: string;
  poster_path: string;
  popularity: number;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  imdb_id: string;
  tagline: string;
  runtime: number;
  genres: { id: number; name: string }[];
  translations?: {
    translations: {
      iso_3166_1: string;
      data: {
        title: string;
      };
    }[];
  };
}
