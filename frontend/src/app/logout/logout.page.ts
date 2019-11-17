import {Component, OnInit} from '@angular/core';
import {UserClient} from '../app.api';
import {Router} from '@angular/router';

@Component({
    selector: 'app-logout',
    templateUrl: '../logout/logout.page.html',
    styleUrls: ['../logout/logout.page.scss'],
})
export class LogoutPage implements OnInit {
    constructor(
        private userClient: UserClient,
        private router: Router) {}

    ngOnInit() {
        this.userClient.logout();
        this.router.navigate(['/login']);
    }
}
