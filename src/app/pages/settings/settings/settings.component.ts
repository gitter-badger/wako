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
  debugMode = false;

  constructor(
    public appService: AppService,
    private router: Router,
    private notificationShowService: NotificationShowService
  ) {
    this.notificationShowService
      .getSettings()
      .then(showsNotificationSettings => (this.showsNotificationSettings = showsNotificationSettings));

    this.appService.debugModeEnabled().then(debugMode => (this.debugMode = debugMode));
  }

  showsNotificationChanged() {
    this.notificationShowService.setSettings(this.showsNotificationSettings);
  }

  setDebugMode() {
    this.appService.setDebugMode(this.debugMode);
  }

  logout() {
    this.appService.logout().subscribe(() => {
      this.router.navigateByUrl('/login');
    });
  }

  simulateError() {
    console.error('Error simulated', { done: true });
  }

  simulateLog() {
    console.log('log simulated', { done: true });
  }

  clearCache() {
    CacheService.clear().then(() => {});
  }
}
