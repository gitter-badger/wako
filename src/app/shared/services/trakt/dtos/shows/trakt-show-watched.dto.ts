export interface TraktShowWatchedDto {
  show: {
    aired_episodes: number;
    ids: {
      trakt: number;
      imdb: string;
      tmdb: number;
    };
    title: string;
    year: number;
    status: 'ended' | 'canceled' | 'returning series';
  };
  seasons: {
    episodes: {
      last_watched_at: string;
      number: number;
      plays: number;
    }[];
  }[];
}
