import { Component } from '@angular/core';
import { AppService } from '../../../shared/services/app/app.service';
import { Router } from '@angular/router';
import { CacheService } from '../../../shared/services/cache.service';

@Component({
  selector: 'wk-trakt-stats',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  constructor(public appService: AppService, private router: Router) {}

  logout() {
    this.appService.logout().subscribe(() => {
      this.router.navigateByUrl('/login');
    });
  }

  clearCache() {
    CacheService.clear().then(() => {});
  }
}
