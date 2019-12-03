import {Component, NgZone} from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UserClient } from './app.api';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'Kalender',
      url: '/home',
      icon: 'calendar'
    },
    {
      title: 'Meine Aufgaben',
      url: '/list-assigned',
      icon: 'checkmark-circle-outline'
    },
    {
      title: 'Erteilte Aufgaben',
      url: '/list',
      icon: 'checkbox-outline'
    },
    {
      title: 'Logout',
      url: '/logout',
      icon: 'log-out',
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
