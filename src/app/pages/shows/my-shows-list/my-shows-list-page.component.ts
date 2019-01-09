import { Component, OnInit } from '@angular/core';
import { MyShowsQuery } from '../../../shared/queries/show/my-shows.query';
import { Show } from '../../../shared/entities/show';
import { ErrorToastService } from '../../../shared/services/app/error-toast.service';

@Component({
  templateUrl: 'my-shows-list-page.component.html'
})
export class MyShowsListPageComponent implements OnInit {
  shows: Show[] = [];

  loading = true;

  constructor(private errorToastService: ErrorToastService) {}

  ngOnInit() {
    this.loading = true;
    this.shows = [];
    MyShowsQuery.getData().subscribe(
      shows => {
        this.loading = false;
        this.shows = shows;
      },
      () => {
        this.loading = false;
        this.errorToastService.create('Failed to load my shows');
      }
    );
  }
}
