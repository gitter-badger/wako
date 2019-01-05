import { Pipe, PipeTransform } from '@angular/core';
import { Torrent } from '../entities/torrent';

@Pipe({
  name: 'wmTorrentSort',
  pure: false
})
export class TorrentSortPipe implements PipeTransform {
  constructor() {}

  private getIntQuality(torrentQuality: string) {
    return torrentQuality === '' ? 0 : +torrentQuality.replace('p', '');
  }

  transform(torrents: Torrent[]): Torrent[] {
    return torrents.sort((a: Torrent, b: Torrent) => {
      if (this.getIntQuality(a.quality) === this.getIntQuality(b.quality)) {
        return b.seeds - a.seeds;
      }

      return this.getIntQuality(b.quality) - this.getIntQuality(a.quality);
    });
  }
}
