import { Component, OnInit } from '@angular/core';
import { MyShowsQuery } from '../../../shared/queries/show/my-shows.query';
import { Show } from '../../../shared/entities/show';

@Component({
  templateUrl: 'my-shows-list.page.html'
})
export class MyShowsListPage implements OnInit {
  shows: Show[] = [];

  loading = true;

  constructor() {}

  ngOnInit() {
    this.loading = true;
    this.shows = [];
    MyShowsQuery.getData().subscribe(shows => {
      this.loading = false;
      this.shows = shows;
    });
  }
}
