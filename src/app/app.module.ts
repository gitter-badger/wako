import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { IonicModule } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

import { AppComponent } from './app.component';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { LoginComponent } from './pages/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { SearchTorrentComponent } from './pages/torrents/search-torrent/search-torrent.component';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Firebase } from '@ionic-native/firebase/ngx';
import { HomeComponent } from './pages/home/home.component';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@NgModule({
  declarations: [AppComponent, LoginComponent, SearchTorrentComponent, HomeComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      swipeBackEnabled: true,
      backButtonText: ''
    }),
    AppRoutingModule,
    IonicStorageModule.forRoot({
      name: 'wako'
    }),
    SharedModule
  ],
  providers: [SplashScreen, InAppBrowser, HTTP, Keyboard, AppVersion, Firebase, LocalNotifications],
  bootstrap: [AppComponent]
})
export class AppModule {}
