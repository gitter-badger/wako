import { EventEmitter } from '@angular/core';

export class TraktEventService {
  static showsEvents = new Map<string, EventEmitter<any>>();

  static emit(showImdbId: string, value?: any) {
    if (!this.showsEvents.has(showImdbId)) {
      this.showsEvents.set(showImdbId, new EventEmitter<any>());
    }

    this.showsEvents.get(showImdbId).next(value);
  }

  static subscribe(showImdbId: string) {
    if (!this.showsEvents.has(showImdbId)) {
      this.showsEvents.set(showImdbId, new EventEmitter<any>());
    }

    return this.showsEvents.get(showImdbId);
  }
}
