interface TraktShowProgressWatchedDto {
  aired: number;
  completed: number;
  last_watched_at: string;
  seasons: [
    {
      number: number;
      aired: number;
      completed: number;
      episodes: [
        {
          number: number;
          completed: boolean;
          last_watched_at: string;
        }
      ];
    }
  ];
  next_episode: {
    season: number;
    number: number;
    title: string;
    ids: {
      trakt: number;
      tvdb: number;
      imdb: string;
      tmdb: number;
      tvrage: number;
    };
  };
}
