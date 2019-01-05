import { KodiHostStructure } from '../structures/kodi-host.structure';
import { ReplaySubject, Subject } from 'rxjs';

export class KodiWsService {
  private static currentWebSocket: WebSocket;

  static wsMessage$ = new Subject<KodiWsMessageResult>();

  static connected$ = new ReplaySubject<boolean>(1);

  static connect(config: KodiHostStructure) {
    const apiBaseUrl = `ws://${config.host}:${config.wsPort ? config.wsPort : 9090}/jsonrpc`;

    this.disconnect();

    this.currentWebSocket = new WebSocket(apiBaseUrl);
    this.currentWebSocket.onopen = () => {
      this.connected$.next(true);
      console.log('Connected to', apiBaseUrl);
    };
    this.currentWebSocket.onclose = () => {
      this.connected$.next(false);
      console.log('disconnected to', apiBaseUrl);
    };

    this.currentWebSocket.onmessage = (ev: MessageEvent) => {
      this.wsMessage$.next(JSON.parse(ev.data));
    };
  }

  static disconnect() {
    if (this.currentWebSocket) {
      this.currentWebSocket.close();
      this.currentWebSocket = null;
    }
  }
}

export interface KodiWsMessageResult {
  id: number;
  jsonrpc: string;
  method: string;
  params: any;
}
