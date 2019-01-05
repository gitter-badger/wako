import { Injectable } from '@angular/core';
import { ProviderService } from './provider.service';
import { Observable, Subscriber } from 'rxjs';
import { TorrentFromProviderQuery } from '../../queries/torrents/torrent-from-provider.query';
import { Provider } from '../../entities/provider';

@Injectable({
  providedIn: 'root'
})
export class TorrentService {
  constructor(private providerService: ProviderService) {}

  has(filter: TorrentsQueryFilter) {
    const runProvider = (subscriber: Subscriber<boolean>, providers: Provider[]) => {
      if (providers.length === 0) {
        subscriber.next(false);
        subscriber.complete();
        return;
      }

      const provider = providers.shift();

      TorrentFromProviderQuery.getData(provider, filter).subscribe(torrents => {
        if (torrents.length > 0) {
          subscriber.next(true);
          subscriber.complete();
        } else {
          runProvider(subscriber, providers);
        }
      });
    };

    return Observable.create(observer => {
      this.providerService.getAll().then(providers => {
        runProvider(observer, providers.filter(provider => provider.enabled_in_list));
      });
    });
  }
}

export interface TorrentsQueryFilter {
  query?: string;
  category: 'movies' | 'tv';
  imdbId?: string;
  title?: string;
  episodeCode?: string;
  year?: number;
  alternativeTitles?: { [key: string]: string };
}
