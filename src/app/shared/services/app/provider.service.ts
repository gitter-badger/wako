import { Injectable } from '@angular/core';
import { Provider } from '../../entities/provider';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  private providerStorageKey = 'provider_key';

  constructor(private storage: Storage) {}

  getAll(enabledOnly = true) {
    return this.getMap().then(providers => {
      let _providers: Provider[] = [];

      providers.forEach(provider => {
        _providers.push(provider);
      });

      if (enabledOnly) {
        _providers = _providers.filter(provider => provider.enabled === true);
      }
      // _providers = _providers.filter(provider => provider.name === 'YTS');

      return _providers;
    });
  }

  getMap() {
    return this.storage.get(this.providerStorageKey).then(providers => {
      const providerMap = new Map<string, Provider>();
      if (providers) {
        Object.keys(providers).forEach(key => {
          providerMap.set(key, providers[key]);
        });
      }
      return providerMap;
    });
  }

  set(providers: { [key: string]: Provider }) {
    return this.storage.set(this.providerStorageKey, providers);
  }
}
