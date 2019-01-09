import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { KodiService } from '../../../../shared/services/app/kodi.service';
import { KodiHostStructure } from '../../../../shared/services/kodi/structures/kodi-host.structure';

@Component({
  templateUrl: 'kodi-remote-list-page.component.html'
})
export class KodiRemoteListPageComponent implements OnInit {
  hosts: KodiHostStructure[] = [];
  currentHostId: string;

  constructor(private kodiService: KodiService, private router: Router) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter(event => {
          return event instanceof NavigationEnd;
        })
      )
      .subscribe(() => {
        this.getList();
      });

    this.getList();
  }

  getList() {
    this.kodiService.getHosts().then(hosts => {
      this.hosts = hosts;

      let selectedHost: KodiHostStructure;

      this.kodiService.getCurrentHost().then(host => {
        this.hosts.forEach(config => {
          if (host && host.host === config.host && host.port === config.port) {
            selectedHost = host;
          }
        });

        if (!selectedHost && hosts.length) {
          selectedHost = hosts[0];
        }

        if (selectedHost) {
          this.currentHostId = selectedHost.host + ':' + selectedHost.port;
        }
      });
    });
  }

  setDefaultHost(hostId: string) {
    const hostParts = hostId.split(':');

    this.hosts.forEach(host => {
      if (host.host === hostParts[0] && host.port === +hostParts[1]) {
        this.kodiService.setCurrentHost(host);
      }
    });
  }

  add() {
    this.router.navigateByUrl('/settings/kodi/host/');
  }

  setHost(host: KodiHostStructure) {
    this.router.navigateByUrl(`/settings/kodi/host/${host.host}:${host.port}`);
  }

  delete(host: KodiHostStructure) {
    this.kodiService.removeHost(host).then(() => this.getList());
  }
}
