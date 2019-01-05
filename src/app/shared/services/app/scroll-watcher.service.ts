import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScrollWatcherService {
  contentScroll = new EventEmitter<true>();

  contentScrollEnd = new EventEmitter<true>();
}
