import { Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { TorrentService, TorrentsQueryFilter } from '../../services/app/torrent.service';
import { IonBadge, IonIcon } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ScrollWatcherService } from '../../services/app/scroll-watcher.service';
import { DomTool } from '../../tools/dom.tool';
import { ProviderService } from '../../services/app/provider.service';

@Component({
  selector: 'wk-has-torrents',
  templateUrl: './has-torrents.component.html'
})
export class HasTorrentsComponent implements OnChanges {
  @Input() filter: TorrentsQueryFilter;

  @ViewChild(IonIcon, { read: ElementRef }) node;

  private hasTorrentsSubscription: Subscription;
  private subscriberLoadTorrents: Subscription;

  private loadTorrentTimer;

  constructor(
    private providerService: ProviderService,
    private torrentService: TorrentService,
    private scrollWatcherService: ScrollWatcherService
  ) {}

  ngOnChanges() {
    this.providerService.getAll().then(providers => {
      if (providers.length === 0) {
        return;
      }
      this.clearAsyncActions();

      this.subscriberLoadTorrents = this.scrollWatcherService.contentScrollEnd.subscribe(() => {
        if (this.loadTorrentTimer) {
          clearTimeout(this.loadTorrentTimer);
        }

        this.loadTorrentTimer = setTimeout(() => {
          if (DomTool.isInViewport(this.node.nativeElement)) {
            this.loadTorrents();
          }
        }, 1000);
      });

      this.loadTorrentTimer = setTimeout(() => {
        if (DomTool.isInViewport(this.node.nativeElement)) {
          this.loadTorrents();
        }
      }, 500);

      this.node.nativeElement.color = 'dark';
    });
  }

  private clearAsyncActions() {
    if (this.subscriberLoadTorrents) {
      this.subscriberLoadTorrents.unsubscribe();
    }

    if (this.loadTorrentTimer) {
      clearTimeout(this.loadTorrentTimer);
    }

    if (this.hasTorrentsSubscription) {
      this.hasTorrentsSubscription.unsubscribe();
    }
  }

  private loadTorrents() {
    this.clearAsyncActions();

    this.node.nativeElement.color = 'primary';

    this.hasTorrentsSubscription = this.torrentService.has(this.filter).subscribe(
      hasTorrent => {
        this.node.nativeElement.color = hasTorrent ? 'success' : 'danger';
      },
      () => (this.node.nativeElement.color = 'danger')
    );
  }
}
