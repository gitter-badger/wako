import { Component, OnInit } from '@angular/core';
import { AppService, DebugItem } from '../../services/app/app.service';
import { ModalController } from '@ionic/angular';
import { SettingsService } from '../../services/app/settings.service';
import { Settings } from '../../entities/settings';

@Component({
  selector: 'wk-debug-modal',
  templateUrl: './debug-modal.component.html',
  styleUrls: ['./debug-modal.component.scss']
})
export class DebugModalComponent implements OnInit {
  list: DebugItem[] = [];

  settings: Settings = null;

  constructor(
    public appService: AppService,
    public settingsService: SettingsService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.settingsService.get().then(settings => {
      this.settings = settings;
      this.handleLogLevel();
    });
  }

  emptyList() {
    if (this.settings.debug.logLevel === 'error') {
      this.appService.errorsList = [];
      this.list = this.appService.errorsList;
    } else if (this.settings.debug.logLevel === 'info') {
      this.appService.infoList = [];
      this.list = this.appService.errorsList;
    } else {
      this.appService.infoList = [];
      this.appService.errorsList = [];
      this.list = [...this.appService.errorsList, ...this.appService.infoList];
    }
  }

  setLogLevel() {
    this.settingsService.set(this.settings);

    this.handleLogLevel();
  }

  private handleLogLevel() {
    if (this.settings.debug.logLevel === 'error') {
      this.list = this.appService.errorsList;
    } else if (this.settings.debug.logLevel === 'info') {
      this.list = this.appService.infoList;
    } else {
      this.list = [...this.appService.errorsList, ...this.appService.infoList];
      this.list.sort((a: DebugItem, b: DebugItem) => {
        if (a.date < b.date) {
          return -1;
        } else if (a.date > b.date) {
          return 1;
        }
        return 0;
      });
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}
