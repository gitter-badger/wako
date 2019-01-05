import { TraktShowDto } from '../../../services/trakt/dtos/shows/trakt-show.dto';
import { Show } from '../../../entities/show';

export class TraktShowToShowQuery {
  static getData(traktShow: TraktShowDto) {
    if (!traktShow) {
      return null;
    }

    const show = new Show();

    show.title = traktShow.title;
    show.year = +traktShow.year;
    show.imdbId = traktShow.ids.imdb;
    show.tmdbId = traktShow.ids.tmdb;
    show.tvdbId = traktShow.ids.tvdb;
    show.overview = traktShow.overview;
    show.firstAired = new Date(traktShow.first_aired);
    show.runtime = +traktShow.runtime;
    show.rating = +traktShow.rating;
    show.votes = +traktShow.votes;
    show.language = traktShow.language;
    show.genres = traktShow.genres;
    show.certification = traktShow.certification;
    show.airedEpisodes = +traktShow.aired_episodes;
    show.totalEpisodesWatched = 0;

    show.images_url = {
      poster: null,
      backdrop: null
    };

    return show;
  }
}
