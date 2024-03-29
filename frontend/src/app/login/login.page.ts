import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiException, LoginResponseVm, LoginVm, UserClient } from '../app.api';
import {MenuController} from '@ionic/angular';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    form: FormGroup;

    constructor(private formBuilder: FormBuilder,
                private userClient: UserClient,
                private router: Router,
                public menuController: MenuController) {
        this.menuController.enable(false, 'mainMenu');
    }

    ngOnInit() {
        this.initForm();
        this.userClient.logout();
    }

    private initForm() {
        this.form = this.formBuilder.group({
            username: ['', [Validators.required, Validators.minLength(6)]],
            password: ['', [Validators.required, Validators.minLength(8)]],
        });
    }

    onSubmit() {
        if (this.form.invalid) {
            this.displayValidationErrors();
            return;
        }

        const loginVm: LoginVm = new LoginVm(this.form.value);
        this.userClient.login(loginVm)
            .subscribe((data: LoginResponseVm) => {
                console.log(data);
                this.router.navigate(['/home']);
            }, (err: ApiException) => {
                console.log(err);
            });
    }

    private displayValidationErrors() {
        const formKeys = Object.keys(this.form.controls);
        formKeys.forEach(key => {
            this.form.controls[key].markAsDirty();
            this.form.controls[key].updateValueAndValidity();
        });
    }
}
