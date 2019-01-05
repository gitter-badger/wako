import { Component, ViewChild, OnInit } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Show } from '../../../shared/entities/show';
import { Subscription } from 'rxjs';
import { ShowSearchQuery } from '../../../shared/queries/show/show-search.query';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  templateUrl: 'show-search-list.page.html'
})
export class ShowSearchListPage implements OnInit {
  searching = true;

  shows: Show[] = [];

  searchInput = '';

  page = 1;

  @ViewChild(IonInfiniteScroll)
  infiniteScroll;

  private searcherSubscribers: Subscription[] = [];

  constructor(private keyboard: Keyboard) {}

  ngOnInit() {
    this.resetSearch();

    this.search();
  }

  hideKeyboard() {
    if (!this.searching) {
      this.keyboard.hide();
    }
  }

  private resetSearch() {
    this.page = 1;
    this.shows = [];

    this.searcherSubscribers.forEach(subscriber => {
      subscriber.unsubscribe();
    });

    this.searcherSubscribers = [];
  }

  onSearch(event: any) {
    this.resetSearch();

    this.searchInput = event.target.value ? event.target.value : '';

    this.search();
  }

  private search() {
    this.searching = true;

    const subscriber = ShowSearchQuery.getData(this.searchInput, this.page).subscribe(shows => {
      this.shows = this.shows.concat(shows);

      this.searching = false;

      if (shows.length === 0) {
        this.infiniteScroll.disabled = true;
      }

      this.infiniteScroll.complete();
    });

    this.searcherSubscribers.push(subscriber);
  }

  searchNextPage() {
    this.page++;

    this.search();
  }
}
