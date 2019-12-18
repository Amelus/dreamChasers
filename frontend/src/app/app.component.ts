import {Component} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent {
    public homePage = {
        title: 'Kalender',
        url: '/home',
        icon: 'calendar'
    };
    public assignedTodoListing = {
        title: 'Meine Aufgaben',
        url: '/list-assigned',
        icon: 'checkmark-circle-outline'
    };
    public givenTodoListing = {
        title: 'Erteilte Aufgaben',
        url: '/list',
        icon: 'checkbox-outline'
    };
    public profile = {
        title: 'Profil',
        url: '/profile',
        icon: 'contact'
    };
    public logout = {
        title: 'Logout',
        url: '/logout',
        icon: 'log-out',
    };
  todoIcon: string;
  expandedTodos: boolean;


    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar
    ) {
        this.initializeApp();
        this.todoIcon = 'arrow-dropdown';
        this.expandedTodos = false;
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    toggleTodos() {
      if (this.expandedTodos) {
        this.todoIcon = 'arrow-dropdown';
      } else {
        this.todoIcon = 'arrow-dropup';
      }
      this.expandedTodos = !this.expandedTodos;
    }
}
