import { Component, OnInit } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {UserClient} from '../app.api';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  passwordForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private userClient: UserClient) { }

  ngOnInit() {
    this.initForm();
  }

  submitPwdChange() {
    if (this.passwordForm.invalid) {
      this.displayValidationErrors();
      return;
    }

    console.log('send update request');
  }

  private equalityValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      if (control.value === this.passwordForm.get('newPassword')) {
        return null;
      } else {
        return {inequality: {value: control.value}};
      }
    };
  }

  private initForm() {
    this.passwordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8), this.equalityValidator]]
    });
  }

  private displayValidationErrors() {
    const formKeys = Object.keys(this.passwordForm.controls);
    formKeys.forEach(key => {
      this.passwordForm.controls[key].markAsDirty();
      this.passwordForm.controls[key].updateValueAndValidity();
    });
  }
}
