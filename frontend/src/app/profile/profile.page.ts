import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {ApiException, UpdateUserResponseVm, UpdateUserVm, UserClient, UserVm, UserVmRole} from '../app.api';
import {AlertController} from '@ionic/angular';
import {catchError} from 'rxjs/operators';
import {throwError} from 'rxjs';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.page.html',
    styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
    form: FormGroup;
    currentUser: UserVm;
    profilePicture: string;
    needsUpgrade: boolean;

    constructor(private formBuilder: FormBuilder,
                private userClient: UserClient,
                private alertController: AlertController) {
    }

    ngOnInit() {
        this.initForm();
        this.initUser();
    }

    submitPwdChange() {
        if (this.form.invalid) {
            this.displayValidationErrors();
            return;
        }

        if (this.form.dirty) {
            const userVm: UpdateUserVm = new UpdateUserVm(this.form.value);
            this.userClient.update(userVm)
                .pipe(catchError((err: ApiException) => throwError(err)))
                .subscribe((user: UpdateUserResponseVm) => {
                    console.log(user);
                    this.profilePicture = user.imageUrl;
                    this.needsUpgrade = user.role === UserVmRole.User;
                }, (err: ApiException) => {
                    console.log(err);
                });

            this.form.reset();

        } else {
            console.log('Nothing to change');
        }
    }

    private oldPwdSetValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (this.form.get('newPassword')) {
                return null;
            } else {
                return {oldPwdSet: {value: control.value}};
            }
        };
    }

    private equalityValidator(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (control.value === this.form.get('newPassword')) {
                return null;
            } else {
                return {inequality: {value: control.value}};
            }
        };
    }

    private initUser() {
        this.currentUser = this.userClient.getSessionUser();
        if (this.currentUser.imageUrl) {
            this.profilePicture = this.currentUser.imageUrl;
        }
        this.needsUpgrade = this.currentUser.role === UserVmRole.User;
    }

    private initForm() {
        this.form = this.formBuilder.group({
            oldPassword: [''],
            newPassword: ['', [Validators.minLength(8), this.oldPwdSetValidator]],
            confirmPassword: ['', [Validators.minLength(8), this.equalityValidator]],
            upgradeCode: [''],
            imageUrl: ['']
        });
    }

    private displayValidationErrors() {
        const formKeys = Object.keys(this.form.controls);
        formKeys.forEach(key => {
            this.form.controls[key].markAsDirty();
            this.form.controls[key].updateValueAndValidity();
        });
    }

    public async openChangeImg() {
        const alert = await this.alertController.create({
            header: 'Bild ändern',
            message: 'Geben Sie die URL zu ihrem Profilbild an',
            inputs: [
                {
                    name: 'imageUrl',
                    type: 'text',
                    placeholder: 'zb. https://imgur.com/profilBild.png',
                    value: this.profilePicture
                }],
            buttons: [
                {
                    text: 'Abbruch',
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: 'Bestätigen',
                    cssClass: 'primary',
                    handler: (data) => {
                        console.log('trigger changePic function');
                        this.form.get('imageUrl').setValue(data.imageUrl);
                        this.form.get('imageUrl').markAsDirty();
                    }
                }
            ]
        });
        await alert.present();
    }

    toggleDarkMode() {
        if (document.body.classList.contains('dark')) {
            document.body.classList.remove('dark');
            localStorage.removeItem('darkMode');
        } else {
            document.body.classList.toggle('dark', true);
            localStorage.setItem('darkMode', 'true');
        }
    }

    doRefresh(event) {
        setTimeout(() => {
            this.userClient.refreshSessionUser();
            event.target.complete();
        }, 2000);
    }
}
