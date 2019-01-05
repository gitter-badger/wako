import { TraktShowSeasonEpisodeDto } from './episodes/trakt-show-season-episode.dto';

export interface TraktShowSeasonDto {
  number: number;
  title: string;
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
  network: string;
  rating: number;
  votes: number;
  episode_count: number;
  aired_episodes: number;
  episodes: TraktShowSeasonEpisodeDto[];
}
