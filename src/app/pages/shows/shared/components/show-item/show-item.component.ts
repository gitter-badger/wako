import { AfterContentInit, Component, ElementRef, Input, OnDestroy } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ScrollWatcherService } from '../../../../../shared/services/app/scroll-watcher.service';
import { DomTool } from '../../../../../shared/tools/dom.tool';
import { Show } from '../../../../../shared/entities/show';
import { TmdbShowGetImagesQuery } from '../../../../../shared/queries/tmdb/show/tmdb-show-get-images.query';
import { TraktShowsGetProgressWatchedForm } from '../../../../../shared/services/trakt/forms/shows/trakt-shows-get-progress-watched.form';
import { EventCategory, EventService, EventShowHistoryChangeData } from '../../../../../shared/services/event.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'wk-show-item',
  templateUrl: 'show-item.component.html',
  styleUrls: ['./show-item.component.scss']
})
export class ShowItemComponent implements AfterContentInit, OnDestroy {
  @Input()
  show: Show;

  isLoadingPoster = null;

  private subscriber;

  private eventSubscriber;

  constructor(
    private elementRef: ElementRef,
    private navController: NavController,
    private scrollWatcherService: ScrollWatcherService
  ) {}

  ngOnDestroy() {
    if (this.subscriber) {
      this.subscriber.unsubscribe();
    }

    if (this.eventSubscriber) {
      this.eventSubscriber.unsubscribe();
    }
  }

  ngAfterContentInit(): void {
    this.subscriber = this.scrollWatcherService.contentScroll.subscribe(() => {
      if (DomTool.isInViewport(this.elementRef.nativeElement)) {
        this._loadData();
      }
    });

    setTimeout(() => {
      if (DomTool.isInViewport(this.elementRef.nativeElement)) {
        this._loadData();
      }
    }, 200);

    this.eventSubscriber = EventService.subscribe<EventShowHistoryChangeData>(EventCategory.showHistory)
      .pipe(filter(event => event.data.showImdbId === this.show.imdbId))
      .subscribe(() => {
        this._loadData();
      });
  }

  private _loadData() {
    if (this.subscriber) {
      this.subscriber.unsubscribe();
    }

    this.initPoster();

    this.setTotalEpisodeToWatch();
  }

  private initPoster() {
    if (this.isLoadingPoster === null) {
      this.isLoadingPoster = true;

      TmdbShowGetImagesQuery.getData(this.show.tmdbId).subscribe(images => {
        this.show.images_url = images;
      });
    }
  }

  private setTotalEpisodeToWatch() {
    TraktShowsGetProgressWatchedForm.submit(this.show.imdbId).subscribe(traktShowProgressWatchedDto => {
      this.show.totalEpisodesWatched = traktShowProgressWatchedDto.completed;
    });
  }

  showDetail() {
    this.navController.navigateForward(`/shows/show/${this.show.imdbId}`);
  }
}
