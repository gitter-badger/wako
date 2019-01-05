import { TraktShowSeasonDto } from '../../../../services/trakt/dtos/shows/seasons/trakt-show-season.dto';
import { Season } from '../../../../entities/season';
import { TraktEpisodeToEpisodeQuery } from './episode/trakt-episode-to-episode.query';

export class TraktSeasonToSeasonQuery {
  static getData(tratkSeason: TraktShowSeasonDto) {
    if (!tratkSeason) {
      return null;
    }
    const season = new Season();

    season.traktNumber = +tratkSeason.number;
    season.title = tratkSeason.title;
    season.imdbId = tratkSeason.ids.imdb;
    season.tmdbId = tratkSeason.ids.tmdb;
    season.tvdbId = tratkSeason.ids.tvdb;
    season.overview = tratkSeason.overview;
    season.firstAired = new Date(tratkSeason.first_aired);
    season.rating = +tratkSeason.rating;
    season.votes = +tratkSeason.votes;
    season.airedEpisodes = +tratkSeason.aired_episodes;
    season.network = tratkSeason.network;
    season.episodeCount = tratkSeason.episode_count;
    season.totalEpisodesWatched = 0;

    season.episodes = tratkSeason.episodes.map(tratkEpisode =>
      TraktEpisodeToEpisodeQuery.getData(tratkEpisode, season.traktNumber)
    );

    return season;
  }
}
