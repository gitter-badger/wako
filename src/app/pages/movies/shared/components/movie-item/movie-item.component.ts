import { Component, ElementRef, Input, OnChanges, OnDestroy } from '@angular/core';
import { Movie } from '../../../../../shared/entities/movie';
import { TmdbMovieGetQuery } from '../../../../../shared/queries/tmdb/movie/tmdb-movie-get.query';
import { NavController } from '@ionic/angular';
import { ScrollWatcherService } from '../../../../../shared/services/app/scroll-watcher.service';
import { DomTool } from '../../../../../shared/tools/dom.tool';
import { MovieHasBeenWatchedQuery } from '../../../../../shared/queries/movie/movie-has-been-watched.query';
import { Subscription } from 'rxjs';
import { TraktMoviesGetWatchListForm } from '../../../../../shared/services/trakt/forms/movies/trakt-movies-get-watch-list.form';

@Component({
  selector: 'wk-movie-item',
  templateUrl: 'movie-item.component.html',
  styleUrls: ['./movie-item.component.scss']
})
export class MovieItemComponent implements OnChanges, OnDestroy {
  @Input()
  movie: Movie;

  isLoadingPoster = null;

  hasBeenWatched = false;

  hasBeenAddedToWatchList = false;

  // private io?: IntersectionObserver;

  private subscriptions: Subscription[] = [];

  private initTimer;

  constructor(
    private elementRef: ElementRef,
    private navController: NavController,
    private scrollWatcherService: ScrollWatcherService
  ) {}

  private clearAsyncActions() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });

    this.subscriptions = [];

    if (this.initTimer) {
      clearTimeout(this.initTimer);
    }
  }

  ngOnDestroy() {
    this.clearAsyncActions();
  }

  ngOnChanges(): void {
    this.clearAsyncActions();

    this.isLoadingPoster = null;
    this.hasBeenWatched = false;
    this.hasBeenAddedToWatchList = false;

    // this.addIO();

    // this.interval = setInterval(() => {
    //   if (DomTool.isInViewport(this.elementRef.nativeElement)) {
    //     clearInterval(this.interval);
    //     this._loadData();
    //   }
    // }, 400);

    this.subscriptions.push(
      this.scrollWatcherService.contentScroll.subscribe(() => {
        if (DomTool.isInViewport(this.elementRef.nativeElement)) {
          this.loadData();
        }
      })
    );

    this.initTimer = setTimeout(() => {
      if (DomTool.isInViewport(this.elementRef.nativeElement)) {
        this.loadData();
      }
    }, 500);
  }

  // private addIO() {
  //   // TODO Handle the day where IntersectionObserver will be available on ios
  //   // this.removeIO();
  //   //
  //   // this.io = new IntersectionObserver(data => {
  //   //   // because there will only ever be one instance
  //   //   // of the element we are observing
  //   //   // we can just use data[0]
  //   //   if (data[0].isIntersecting) {
  //   //     this.removeIO();
  //   //     this._loadData();
  //   //   }
  //   // });
  //   //
  //   // this.io.observe(this.elementRef.nativeElement);
  // }

  private loadData() {
    this.clearAsyncActions();

    if (this.isLoadingPoster === null) {
      this.isLoadingPoster = true;

      this.subscriptions.push(
        TmdbMovieGetQuery.getData(this.movie.tmdbId, this.movie.imdbId).subscribe(images => {
          this.movie.images_url = images;
        })
      );
    }

    this.subscriptions.push(
      MovieHasBeenWatchedQuery.getData(this.movie.imdbId).subscribe(
        hasBeenWatched => (this.hasBeenWatched = hasBeenWatched)
      )
    );
    this.subscriptions.push(
      TraktMoviesGetWatchListForm.submit().subscribe(trakMovies => {
        trakMovies.forEach(trakMovie => {
          if (this.movie.imdbId === trakMovie.ids.imdb) {
            this.hasBeenAddedToWatchList = true;
          }
        });
      })
    );
  }

  // private removeIO() {
  //   if (this.io) {
  //     this.io.disconnect();
  //     this.io = undefined;
  //   }
  // }

  showDetail() {
    if (this.movie.imdbId) {
      this.navController.navigateForward(`/movies/movie/${this.movie.imdbId}`);
    } else {
      this.navController.navigateForward(`/movies/movie/trakt/${this.movie.traktId}`);
    }
  }
}
