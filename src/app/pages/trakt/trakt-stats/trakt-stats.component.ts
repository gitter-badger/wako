import { Component, OnInit } from '@angular/core';
import { TraktUsersMeForm } from '../../../shared/services/trakt/forms/users/trakt-users-me.form';
import { TraktUsersStatsForm } from '../../../shared/services/trakt/forms/users/trakt-users-stats.form';
import { TraktUserStatsDto } from '../../../shared/services/trakt/dtos/user/trakt-user-stats.dto';
import { AppService } from '../../../shared/services/app/app.service';
import { Router } from '@angular/router';
import { CacheService } from '../../../shared/services/cache.service';

@Component({
  selector: 'wk-trakt-stats',
  templateUrl: './trakt-stats.component.html',
  styleUrls: ['./trakt-stats.component.scss']
})
export class TraktStatsComponent implements OnInit {
  username = '';

  stats: TraktUserStatsDto;

  constructor(public appService: AppService, private router: Router) {}

  ngOnInit() {
    TraktUsersMeForm.submit().subscribe(user => (this.username = user.username));
    TraktUsersStatsForm.submit().subscribe(stats => (this.stats = stats));
  }

  logout() {
    this.appService.logout().subscribe(() => {
      this.router.navigateByUrl('/login');
    });
  }

  clearCache() {
    CacheService.clear().then(() => {});
  }

  clickOpenMenu(event) {
    console.log('click open menu', { event });
  }
}
