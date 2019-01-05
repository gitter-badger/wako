import { Injectable } from '@angular/core';
import { Observable, Observer, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private wsList = new Map<string, WebSocket>();

  connect(url: string): Subject<MessageEvent> {
    return this.create(url);
  }

  disconnect(url: string) {
    if (this.wsList.has(url)) {
      this.wsList.get(url).close();
    }
  }

  private create(url: string): Subject<MessageEvent> {
    this.disconnect(url);

    const ws = new WebSocket(url);

    this.wsList.set(url, ws);

    const observable = Observable.create((obs: Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });
    const observer = {
      next: (data: Object) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    };

    return Subject.create(observer, observable);
  }
}
