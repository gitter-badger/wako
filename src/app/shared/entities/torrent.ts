export class Torrent {
  providerName: string;
  title: string;
  seeds: number;
  peers: number;
  size_bytes?: number;
  size_str?: string;
  quality: string;
  url: string;
  isAccurate?: boolean;
}
