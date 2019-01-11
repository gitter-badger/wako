import { Component, OnInit } from '@angular/core';
import { AppService, DebugItem } from '../../services/app/app.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'wk-debug-modal',
  templateUrl: './debug-modal.component.html',
  styleUrls: ['./debug-modal.component.scss']
})
export class DebugModalComponent implements OnInit {
  list: DebugItem[] = [];

  private logLevel = 'error';

  constructor(public appService: AppService, private modalCtrl: ModalController) {
    this.setlogLevel(this.logLevel);
  }

  ngOnInit() {}

  emptyList() {
    if (this.logLevel === 'error') {
      this.appService.errorsList = [];
      this.list = this.appService.errorsList;
    } else if (this.logLevel === 'info') {
      this.appService.infoList = [];
      this.list = this.appService.errorsList;
    } else {
      this.appService.infoList = [];
      this.appService.errorsList = [];
      this.list = [...this.appService.errorsList, ...this.appService.infoList];
    }
  }

  setlogLevel(logLevel: string) {
    this.logLevel = logLevel;
    if (this.logLevel === 'error') {
      this.list = this.appService.errorsList;
    } else if (this.logLevel === 'info') {
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
