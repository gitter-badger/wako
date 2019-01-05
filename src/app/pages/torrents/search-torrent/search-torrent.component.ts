import { Component } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  templateUrl: './search-torrent.component.html'
})
export class SearchTorrentComponent {
  searchInput = '';

  constructor(private keyboard: Keyboard) {}

  hideKeyboard() {
    this.keyboard.hide();
  }

  onSearch(event: any) {
    this.searchInput = event.target.value ? event.target.value : '';
  }
}
