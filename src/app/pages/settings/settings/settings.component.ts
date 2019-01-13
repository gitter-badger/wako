import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../shared/services/app/app.service';
import { Router } from '@angular/router';
import { CacheService } from '../../../shared/services/cache.service';
import { SettingsService } from '../../../shared/services/app/settings.service';
import { Settings } from '../../../shared/entities/settings';

@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  settings: Settings = null;

  constructor(public appService: AppService, private router: Router, private settingsService: SettingsService) {}

  ngOnInit(): void {
    this.settingsService.get().then(settings => (this.settings = settings));
  }

  setSettings() {
    this.settingsService.set(this.settings);
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
