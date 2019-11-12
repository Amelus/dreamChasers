import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import {ApiException, RegisterVm, UserClient, UserVm} from '../app.api';
import {Router} from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  form: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private userClient: UserClient,
              private router: Router) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      registrationCode: ['', [Validators.required, Validators.minLength(6)]],
      username: ['', [Validators.required, Validators.minLength(6)]], // add validator to check for small letters
      password: ['', [Validators.required, Validators.minLength(8)]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.displayValidationErrors();
      return;
    }

    const registerVm: RegisterVm = new RegisterVm(this.form.value);
    this.userClient.register(registerVm)
        .pipe(catchError((err: ApiException) => throwError(err)))
        .subscribe((user: UserVm) => {
          console.log(user);
          this.router.navigate(['/login']);
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
