export class Show {
  title: string;
  year: number;
  imdbId: string;
  tmdbId: number;
  tvdbId: number;
  overview: string;
  firstAired: Date;
  runtime: number;
  rating: number;
  votes: number;
  language: string;
  genres: string[];
  certification: any;
  airedEpisodes: number;
  images_url?: {
    poster?: string;
    backdrop?: string;
  };
  totalEpisodesWatched: number;
}
