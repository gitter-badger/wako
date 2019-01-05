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
          url: '/kodi',
          icon: 'logo-youtube',
          title: 'Kodi'
        },
        {
          url: '/trakt',
          icon: 'log-in',
          title: 'Trakt'
        },
        {
          url: '/providers',
          icon: 'wifi',
          title: 'Providers'
        }
      ]
    }
  ];

  constructor(public appService: AppService) {}
}
