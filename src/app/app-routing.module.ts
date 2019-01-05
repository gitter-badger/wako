import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnAuthGuard } from './shared/services/app/guard/un-auth-guard.service';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './shared/services/app/guard/auth-guard.service';
import { SearchTorrentComponent } from './pages/torrents/search-torrent/search-torrent.component';

const routes: Routes = [
  {
    path: 'login',
    canActivate: [UnAuthGuard],
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: '/trakt',
    pathMatch: 'full'
  },
  {
    path: 'search-provider',
    component: SearchTorrentComponent
  },
  {
    path: 'movies',
    canActivate: [AuthGuard],
    loadChildren: './pages/movies/movies.module#MoviesModule'
  },
  {
    path: 'shows',
    canActivate: [AuthGuard],
    loadChildren: './pages/shows/shows.module#ShowsModule'
  },
  {
    path: 'kodi',
    canActivate: [AuthGuard],
    loadChildren: './pages/kodi/kodi.module#KodiModule'
  },
  {
    path: 'trakt',
    canActivate: [AuthGuard],
    loadChildren: './pages/trakt/trakt.module#TraktModule'
  },
  {
    path: 'providers',
    canActivate: [AuthGuard],
    loadChildren: './pages/provider/provider.module#ProviderModule'
  }
  // {
  //   path: '**',
  //   redirectTo: '/home',
  //   pathMatch: 'full'
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {}
