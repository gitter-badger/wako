import { Component } from '@angular/core';
import { AppService } from '../../../shared/services/app/app.service';
import { Router } from '@angular/router';
import { CacheService } from '../../../shared/services/cache.service';
import {
  NotificationShowService,
  ShowsNotificationSettings
} from '../../../shared/services/app/notification-show.service';

@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  showsNotificationSettings: ShowsNotificationSettings = null;

  constructor(
    public appService: AppService,
    private router: Router,
    private notificationShowService: NotificationShowService
  ) {
    this.notificationShowService
      .getSettings()
      .then(showsNotificationSettings => (this.showsNotificationSettings = showsNotificationSettings));
  }

  showsNotificationChanged() {
    this.notificationShowService.setSettings(this.showsNotificationSettings);
  }

  logout() {
    this.appService.logout().subscribe(() => {
      this.router.navigateByUrl('/login');
    });
  }

  clearCache() {
    CacheService.clear().then(() => {});
  }
}
