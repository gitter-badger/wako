import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Movie } from '../../../shared/entities/movie';
import { BrowserService } from '../../../shared/services/app/browser.service';
import { MovieGetByIdQuery } from '../../../shared/queries/movie/movie-get-by-id.query';
import { TraktMoviesGetWatchedForm } from '../../../shared/services/trakt/forms/movies/trakt-movies-get-watched.form';
import { TraktHistoryAddForm } from '../../../shared/services/trakt/forms/history/trakt-history-add.form';
import { TraktHistoryRemoveForm } from '../../../shared/services/trakt/forms/history/trakt-history-remove.form';
import { TraktWatchlistAddForm } from '../../../shared/services/trakt/forms/watchlist/trakt-watchlist-add.form';
import { TraktWatchlistRemoveForm } from '../../../shared/services/trakt/forms/watchlist/trakt-watchlist-remove.form';
import { TraktMoviesGetWatchListForm } from '../../../shared/services/trakt/forms/movies/trakt-movies-get-watch-list.form';
import { MovieGetImdbRelatedQuery } from '../../../shared/queries/movie/movie-get-imdb-related.query';
import { ImdbItem, ImdbItemQuery } from '../../../shared/queries/imdb/imdb-item.query';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Torrent } from '../../../shared/entities/torrent';
import { ElementumQueryParam } from '../../../shared/entities/elementum-query-param';

@Component({
  templateUrl: 'movie-detail-page.component.html',
  styleUrls: ['./movie-detail-page.component.scss']
})
export class MovieDetailPageComponent {
  movie: Movie = null;

  segment = 'torrents';

  hasBeenWatched = false;

  hasBeenAddedToWatchList = false;

  relatedMoviesIsLoading = false;

  relatedMovies: Movie[] = [];

  imdbItem: ImdbItem;

  torrents: Torrent[] | null = null;

  elementumQueryParam: ElementumQueryParam = {
    category: 'movie'
  };

  constructor(
    private route: ActivatedRoute,
    private toastCtrl: ToastController,
    private browserService: BrowserService
  ) {}

  ionViewDidEnter() {
    this.route.paramMap.subscribe(data => {
      const imdbId = data.get('imdbId');
      const traktId = data.get('traktId');

      this.movie = null;
      this.segment = 'torrents';
      this.hasBeenWatched = false;
      this.hasBeenAddedToWatchList = false;
      this.relatedMovies = [];
      this.relatedMoviesIsLoading = false;
      this.torrents = null;

      this.imdbItem = null;

      MovieGetByIdQuery.getData(imdbId || traktId).subscribe(
        movie => {
          this.init(movie);
        },
        () => {
          this.movieNotFound();
        }
      );
    });
  }

  private movieNotFound() {
    this.toastCtrl
      .create({
        message: 'Movie not found on trakt',
        duration: 3000
      })
      .then(toast => toast.present());
  }

  private init(movie: Movie) {
    if (!movie) {
      return this.movieNotFound();
    }

    this.elementumQueryParam.tmdbId = movie.tmdbId;

    this.movie = movie;

    TraktMoviesGetWatchedForm.submit().subscribe(dtos => {
      dtos.forEach(dto => {
        if (this.movie.imdbId === dto.movie.ids.imdb) {
          this.hasBeenWatched = true;
        }
      });
    });

    TraktMoviesGetWatchListForm.submit().subscribe(trakMovies => {
      trakMovies.forEach(trakMovie => {
        if (this.movie.imdbId === trakMovie.ids.imdb) {
          this.hasBeenAddedToWatchList = true;
        }
      });
    });

    if (this.movie.imdbId) {
      ImdbItemQuery.getData(this.movie.imdbId).subscribe(imdbItem => {
        this.movie.relatedIds = imdbItem.relatedIds;

        this.imdbItem = imdbItem;
      });
    }
  }

  segmentChanged() {
    if (this.segment === 'related') {
      this.loadRelatedMovies();
    }
  }

  private loadRelatedMovies() {
    let obs = of(null);
    if (this.relatedMovies.length === 0) {
      this.relatedMoviesIsLoading = true;
      obs = ImdbItemQuery.getData(this.movie.imdbId).pipe(
        tap(imdbItem => {
          this.movie.relatedIds = imdbItem.relatedIds;
        })
      );
    }

    obs.subscribe(() => {
      if (this.movie.relatedIds.length > 0 && this.relatedMovies.length === 0) {
        MovieGetImdbRelatedQuery.getData(this.movie.relatedIds).subscribe(movies => {
          this.relatedMovies = movies;

          this.relatedMoviesIsLoading = false;
        });
      } else {
        this.relatedMoviesIsLoading = false;
      }
    });
  }

  showTrailer() {
    this.browserService.open(`http://www.imdb.com/title/${this.movie.imdbId}/`);
  }

  toggleWatched() {
    if (!this.hasBeenWatched) {
      TraktHistoryAddForm.submit({ movieImdbId: this.movie.imdbId }).subscribe(added => {
        if (!added) {
          this.hasBeenWatched = false;
        } else {
          this.hasBeenAddedToWatchList = false;
        }
      });
      this.hasBeenWatched = true;
    } else {
      TraktHistoryRemoveForm.submit({ movieImdbId: this.movie.imdbId }).subscribe(removed => {
        if (!removed) {
          this.hasBeenWatched = true;
        }
      });
      this.hasBeenWatched = false;
    }
  }

  toggleWish() {
    if (!this.hasBeenAddedToWatchList) {
      TraktWatchlistAddForm.submit(this.movie.imdbId).subscribe(added => {
        if (!added) {
          this.hasBeenAddedToWatchList = false;
        }
      });
      this.hasBeenAddedToWatchList = true;
    } else {
      TraktWatchlistRemoveForm.submit(this.movie.imdbId).subscribe(removed => {
        if (!removed) {
          this.hasBeenAddedToWatchList = true;
        }
      });
      this.hasBeenAddedToWatchList = false;
    }
  }
}
