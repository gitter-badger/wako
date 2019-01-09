import { Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { NavigationEnd, Router } from '@angular/router';
import { ProviderService } from '../../../../shared/services/app/provider.service';
import { Provider } from '../../../../shared/entities/provider';

@Component({
  selector: 'wk-provider-list',
  templateUrl: './provider-list.component.html'
})
export class ProviderListComponent implements OnInit {
  providersMap = new Map<string, Provider>();

  constructor(private providerService: ProviderService, private router: Router) {}

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
    this.providerService.getMap().then(providers => {
      this.providersMap = providers;
    });
  }

  toggleProvider(key: string, enabled: boolean) {
    if (this.providersMap.has(key)) {
      this.providersMap.get(key).enabled = enabled;
      this.save();
    }
  }

  add() {
    this.router.navigateByUrl('/settings/providers/set-json');
  }

  delete(key: string) {
    if (this.providersMap.has(key)) {
      this.providersMap.delete(key);
      this.save();
    }
  }

  private save() {
    const providersWithKey: { [key: string]: Provider } = {};

    this.providersMap.forEach((provider, key) => {
      providersWithKey[key] = provider;
    });

    this.providerService.set(providersWithKey);
  }
}
