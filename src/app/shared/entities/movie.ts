export class Movie {
  title: string;
  year: number;
  imdbId: string;
  traktId: number;
  tmdbId?: number;
  tagline?: string;
  overview: string;
  released?: string;
  runtime: number;
  trailer: string;
  rating: number;
  votes: number;
  language: string;
  genres: string[];
  certification: string;
  images_url?: {
    poster?: string;
    backdrop?: string;
  };
  isDataComplete = true;
  relatedIds: string[] = [];
  alternative_titles?: { [key: string]: string };
}
