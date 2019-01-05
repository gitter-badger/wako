import { TraktShowSeasonEpisodeDto } from '../../../../../services/trakt/dtos/shows/seasons/episodes/trakt-show-season-episode.dto';
import { Episode } from '../../../../../entities/episode';

export class TraktEpisodeToEpisodeQuery {
  private static add0(value: number) {
    if (value < 10) {
      return '0' + value;
    }

    return value;
  }

  private static getEpisodeCode(seasonNumber: number, episodeNumber) {
    return 'S' + this.add0(seasonNumber).toString() + 'E' + this.add0(episodeNumber).toString();
  }

  static getData(tratkEpisode: TraktShowSeasonEpisodeDto, seasonNumber: number) {
    if (!tratkEpisode) {
      return null;
    }

    const episode = new Episode();

    episode.traktSeasonNumber = +seasonNumber;
    episode.traktNumber = +tratkEpisode.number;
    episode.code = this.getEpisodeCode(+seasonNumber, +tratkEpisode.number);
    episode.title = tratkEpisode.title;
    episode.imdbId = tratkEpisode.ids.imdb;
    episode.tmdbId = tratkEpisode.ids.tmdb;
    episode.tvdbId = tratkEpisode.ids.tvdb;
    episode.traktId = tratkEpisode.ids.trakt;
    episode.overview = tratkEpisode.overview;
    episode.firstAired = new Date(tratkEpisode.first_aired);
    episode.rating = +tratkEpisode.rating;
    episode.votes = +tratkEpisode.votes;
    episode.runtime = +tratkEpisode.runtime;
    episode.watched = false;

    return episode;
  }
}
