import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';
import { Torrent } from '../../entities/torrent';
import { TorrentService, TorrentsQueryFilter } from '../../services/app/torrent.service';
import { from, Subscription } from 'rxjs';
import { ProviderService } from '../../services/app/provider.service';
import { finalize, tap } from 'rxjs/operators';
import { TorrentFromProviderQuery } from '../../queries/torrents/torrent-from-provider.query';
import { Provider } from '../../entities/provider';

@Component({
  selector: 'wk-torrent-list',
  templateUrl: './torrent-list.component.html',
  styleUrls: ['./torrent-list.component.scss']
})
export class TorrentListComponent implements OnChanges, OnDestroy {
  @Input() filter: TorrentsQueryFilter;

  @Output() torrentsFound = new EventEmitter<Torrent[]>();

  @Input() torrents: Torrent[] | null = null;

  totalTorrents = 0;

  torrents1080p: Torrent[] = [];
  torrents720p: Torrent[] = [];
  torrentsOther: Torrent[] = [];

  retrievingTorrents = false;

  initialized = false;

  get loadingByProvider() {
    const data = [];
    Object.keys(this.loaderByProvider).forEach(key => {
      data.push(this.loaderByProvider[key]);
    });

    return data;
  }

  providers: Provider[] = [];

  private loaderByProvider: { [key: string]: LoaderProvider } = {};

  private subscriptions: Subscription[] = [];

  constructor(private torrentService: TorrentService, private providerService: ProviderService) {}

  ngOnChanges(changes: SimpleChanges) {
    this.getProviders().subscribe(providers => {
      this.providers = providers;

      this.subscriptions.forEach(_subscriber => {
        _subscriber.unsubscribe();
      });

      if (this.torrents !== null) {
        this.setTorrents(this.torrents);

        this.retrievingTorrents = false;
      } else if (this.filter.query && this.filter.query.length === 0) {
        this.setTorrents([]);

        this.retrievingTorrents = false;
      } else {
        this.retrievingTorrents = true;

        this.getTorrents(providers);
      }

      this.initialized = true;
    });
  }

  private getProviders() {
    return from(this.providerService.getAll());
  }

  private getTorrents(providers: Provider[]) {
    this.loaderByProvider = {};

    let totalLoaded = 0;

    let allTorrents = [];

    providers.forEach(provider => {
      this.loaderByProvider[provider.name] = {
        torrents: [],
        providerName: provider.name,
        isLoading: true,
        subscription: null
      };

      this.loaderByProvider[provider.name].subscription = TorrentFromProviderQuery.getData(provider, this.filter)
        .pipe(
          tap(torrents => {
            allTorrents = allTorrents.concat(torrents);

            this.loaderByProvider[provider.name].torrents = torrents;
            this.loaderByProvider[provider.name].isLoading = false;
          }),
          finalize(() => {
            totalLoaded++;
            if (totalLoaded === providers.length) {
              this.setTorrents(allTorrents);
              this.retrievingTorrents = false;
            }
          })
        )
        .subscribe();

      this.subscriptions.push(this.loaderByProvider[provider.name].subscription);
    });
  }

  private setTorrents(torrents: Torrent[]) {
    this.totalTorrents = torrents.length;

    this.torrents1080p = [];
    this.torrents720p = [];
    this.torrentsOther = [];

    torrents.forEach(torrent => {
      if (torrent.quality === '1080p') {
        this.torrents1080p.push(torrent);
      } else if (torrent.quality === '720p') {
        this.torrents720p.push(torrent);
      } else {
        this.torrentsOther.push(torrent);
      }
    });

    this.torrentsFound.next(torrents);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(_subscriber => {
      _subscriber.unsubscribe();
    });
  }

  stopLoadingProvider(loader: LoaderProvider) {
    loader.isLoading = false;
    loader.subscription.unsubscribe();
  }
}

interface LoaderProvider {
  torrents: Torrent[];
  providerName: string;
  isLoading: boolean;
  subscription: Subscription;
}
