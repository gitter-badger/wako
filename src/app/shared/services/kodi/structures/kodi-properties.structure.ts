import { KodiHostStructure } from './kodi-host.structure';

export interface KodiPropertiesStructure {
  host: KodiHostStructure;
  app: {
    volume: number;
    muted: boolean;
  };
  player?: {
    id: number;
    isPlaying: boolean;
    isPaused: boolean;
    subtitleEnabled: boolean;
    media: {
      label: string;
      thumbnail: string;
      totalSeconds: number;
      currentSeconds: number;
    };
  };
}
