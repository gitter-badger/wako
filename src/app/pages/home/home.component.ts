import { Component, OnInit } from '@angular/core';
import { TraktUserStatsDto } from '../../shared/services/trakt/dtos/user/trakt-user-stats.dto';
import { TraktUsersMeForm } from '../../shared/services/trakt/forms/users/trakt-users-me.form';
import { TraktUsersStatsForm } from '../../shared/services/trakt/forms/users/trakt-users-stats.form';
import { ShowUpNextToWatchQuery } from '../../shared/queries/show/show-up-next-to-watch.query';
import { NextEpisodeToWatch } from '../../shared/entities/next-episode-to-watch';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'wk-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  username = '';

  stats: TraktUserStatsDto;

  upNextToWatch: NextEpisodeToWatch[] = [];

  upNextToWatchLoading = true;

  constructor() {}

  ngOnInit() {
    TraktUsersMeForm.submit().subscribe(user => (this.username = user.username));
    TraktUsersStatsForm.submit().subscribe(stats => (this.stats = stats));

    ShowUpNextToWatchQuery.getData()
      .pipe(finalize(() => (this.upNextToWatchLoading = false)))
      .subscribe(upNextToWatch => {
        this.upNextToWatch = upNextToWatch;
      });
  }

  clickOpenMenu(event) {
    console.log('click open menu', { event });
  }
}
