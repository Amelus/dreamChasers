import {CanActivate, Router} from '@angular/router';
import {UserClient} from '../app.api';

export class AuthGuard implements CanActivate {
    constructor(private router: Router,
                private userclient: UserClient) { }

    canActivate() {
        // make check for token
        if (this.userclient.getSessionUser()) {
            return true;
        }
        this.router.navigate(['login']);
        return false;
    }
}
