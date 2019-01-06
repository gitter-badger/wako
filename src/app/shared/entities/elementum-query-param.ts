export interface ElementumQueryParam {
  tmdbId?: number;
  category?: 'movie' | 'episode';
  tmdbShowId?: number;
  seasonNumber?: number;
  episodeNumber?: number;
  query?: string;
}
