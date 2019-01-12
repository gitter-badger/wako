export interface TraktUserHiddenItemDto {
  hidden_at: string;
  type: 'movie' | 'show';
  show: {
    title: string;
    year: number;
    ids: {
      trakt: number;
      slug: string;
      tvdb: number;
      imdb: string;
      tmdb: number;
    };
  };
}
