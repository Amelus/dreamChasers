import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import { API_BASE_URL } from './app.api';
import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {FormBuilder} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptor} from './auth/auth.interceptor';
import {AuthGuard} from './auth/auth.guard';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [
        BrowserModule,
        HttpClientModule,
        IonicModule.forRoot(),
        AppRoutingModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        FormBuilder,
        { provide: API_BASE_URL, useFactory: baseUrl },
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor , multi: true },
        AuthGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

export function baseUrl(): string {
    return 'http://localhost:3000' + '/api';
}
