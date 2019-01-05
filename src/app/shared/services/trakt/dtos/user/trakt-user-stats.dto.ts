export interface TraktUserStatsDto {
  movies: {
    plays: number;
    watched: number;
  };
  shows: {
    watched: number;
  };
  episodes: {
    plays: number;
    watched: number;
  };
}
