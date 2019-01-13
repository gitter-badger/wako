import { Component } from '@angular/core';
import { AppService } from './shared/services/app/app.service';

@Component({
  selector: 'wk-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public menuPages = [
    {
      icon: 'film',
      color: 'primary',
      title: 'Movies',
      pages: [
        {
          url: '/movies/search',
          icon: 'search',
          title: 'Search'
        },
        {
          url: '/movies/wish-list',
          icon: 'bookmark',
          title: 'Wish list'
        },
        {
          url: '/movies/watched-list',
          icon: 'eye',
          title: 'Watched list'
        }
      ]
    },
    {
      icon: 'logo-closed-captioning',
      color: 'secondary',
      title: 'Shows',
      pages: [
        {
          url: '/shows/search',
          icon: 'search',
          title: 'Search'
        },
        {
          url: '/shows/my-shows',
          icon: 'eye',
          title: 'My Shows'
        }
      ]
    },
    {
      icon: 'cloud-download',
      color: 'tertiary',
      title: 'Sources',
      pages: [
        {
          url: '/search-provider',
          icon: 'search',
          title: 'Search'
        }
      ]
    },
    {
      icon: 'settings',
      color: 'warning',
      title: 'Settings',
      pages: [
        {
          url: '/settings/kodi',
          icon: 'logo-youtube',
          title: 'Kodi'
        },
        {
          url: '/settings/providers',
          icon: 'wifi',
          title: 'Providers'
        },
        {
          url: '/settings',
          icon: 'settings',
          title: 'Settings'
        }
      ]
    }
  ];

  constructor(public appService: AppService) {}
}
