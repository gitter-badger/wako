import { NgModule } from '@angular/core';

import { IonicModule } from '@ionic/angular';
import { TorrentItemComponent } from './components/torrent-item/torrent-item.component';
import { CommonModule } from '@angular/common';
import { FileSizePipe } from './pipes/file-size.pipe';
import { TorrentSortPipe } from './pipes/torrent-sort.pipe';
import { FormatTimePipe } from './pipes/format-time.pipe';
import { ScrollWatcherDirective } from './directives/scroll-watcher/scroll-watcher.directive';
import { KodiRemoteModal } from './modals/kodi-remote/kodi-remote.modal';
import { FormsModule } from '@angular/forms';
import { TorrentListComponent } from './components/torrent-list/torrent-list.component';
import { KodiRemoteToolbarComponent } from './components/kodi-remote-toolbar/kodi-remote-toolbar.component';
import { HasTorrentsComponent } from './components/has-torrents/has-torrents.component';
import { DebugModalComponent } from './modals/debug-modal/debug-modal.component';

const pipes = [FileSizePipe, TorrentSortPipe, FormatTimePipe];

const components = [
  TorrentListComponent,
  TorrentItemComponent,
  KodiRemoteModal,
  KodiRemoteToolbarComponent,
  HasTorrentsComponent,
  DebugModalComponent
];

const entryComponents = [KodiRemoteModal, DebugModalComponent];

const directives = [ScrollWatcherDirective];

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [...pipes, ...components, ...directives],
  entryComponents: [...entryComponents],
  exports: [...pipes, ...components, ...directives]
})
export class SharedModule {}
