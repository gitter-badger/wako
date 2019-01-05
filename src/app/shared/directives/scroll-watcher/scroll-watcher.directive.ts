import { Directive, OnDestroy, OnInit } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { ScrollWatcherService } from '../../services/app/scroll-watcher.service';
import { Subscriber } from 'rxjs';

@Directive({
  selector: '[appScrollWatcher]'
})
export class ScrollWatcherDirective implements OnInit, OnDestroy {
  private subscriber: Subscriber<any>;
  private subscriberEnd: Subscriber<any>;

  constructor(private host: IonContent, private scrollWatcherService: ScrollWatcherService) {}

  ngOnInit() {
    if (this.host instanceof IonContent) {
      this.subscriber = this.host.ionScroll.subscribe(() => this.scrollWatcherService.contentScroll.next(true));
      this.subscriberEnd = this.host.ionScrollEnd.subscribe(() =>
        this.scrollWatcherService.contentScrollEnd.next(true)
      );
    }
  }

  ngOnDestroy() {
    if (this.subscriber) {
      this.subscriber.unsubscribe();
    }
    if (this.subscriberEnd) {
      this.subscriberEnd.unsubscribe();
    }
  }
}
