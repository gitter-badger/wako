import { Component, OnInit } from '@angular/core';
import { ProviderService } from '../../../../shared/services/app/provider.service';
import { Router } from '@angular/router';
import { Provider } from '../../../../shared/entities/provider';

@Component({
  selector: 'wk-provider-set-json',
  templateUrl: './provider-set-json.component.html',
  styleUrls: ['./provider-set-json.component.scss']
})
export class ProviderSetJsonComponent implements OnInit {
  code = '';

  constructor(private providerService: ProviderService, private router: Router) {}

  ngOnInit() {
    this.providerService.getMap().then(providers => {
      const providersWithKey: { [key: string]: Provider } = {};

      providers.forEach((provider, key) => {
        providersWithKey[key] = provider;
      });

      this.code = JSON.stringify(providersWithKey, null, 4);
    });
  }

  save() {
    try {
      const json = JSON.parse(this.code);
      console.log('Valid JSON', json);
      this.providerService
        .set(json)
        .then(() => {
          this.router.navigateByUrl('/settings/providers');
        })
        .catch(err => {
          alert(err.message);
        });
    } catch (e) {
      alert(e.toString());
    }
  }
}
