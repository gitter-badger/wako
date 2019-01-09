import { Component, OnInit } from '@angular/core';
import { TraktUserStatsDto } from '../../shared/services/trakt/dtos/user/trakt-user-stats.dto';
import { TraktUsersMeForm } from '../../shared/services/trakt/forms/users/trakt-users-me.form';
import { TraktUsersStatsForm } from '../../shared/services/trakt/forms/users/trakt-users-stats.form';

@Component({
  selector: 'wk-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  username = '';

  stats: TraktUserStatsDto;

  constructor() {}

  ngOnInit() {
    TraktUsersMeForm.submit().subscribe(user => (this.username = user.username));
    TraktUsersStatsForm.submit().subscribe(stats => (this.stats = stats));
  }

  clickOpenMenu(event) {
    console.log('click open menu', { event });
  }
}
