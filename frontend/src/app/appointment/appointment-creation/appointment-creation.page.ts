import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppointmentClient, AppointmentVm} from '../../app.api';
import * as moment from 'moment';
import {Moment} from 'moment';

@Component({
  selector: 'app-appointment-creation',
  templateUrl: './appointment-creation.page.html',
  styleUrls: ['./appointment-creation.page.scss'],
})
export class AppointmentCreationPage implements OnInit {

  private form: FormGroup;
  private appointments: AppointmentVm[];
  private allDay: boolean;
  private minDate: string;
  private maxDate: string;
  private monthNames = 'Jan, Feb, Mar, Apr, Mai, Jun, Jul, Aug, Sep, Oct, Nov, Dec';

  constructor(public modalController: ModalController,
              private formBuilder: FormBuilder,
              private params: NavParams,
              private appointmentClient: AppointmentClient) {
  }

  ngOnInit() {
    this.initForm();
    this.allDay = false;
    const now: Moment = moment();
    this.minDate = (now).toISOString();
    const newDate = moment(now).add(1, 'year');
    this.maxDate = newDate.toISOString();
  }

  public async dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

    onSubmit() {
      if (this.form.invalid) {
        this.displayValidationErrors();
        return;
      }



      this.dismiss();
    }

  toggleAllDay() {
    this.allDay = !this.allDay;
  }

  private initForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      content: [''],
      startDay: ['', Validators.required],
      endDay: [''],
      startHour: [''],
      endHour: [''],
      allDay: [''],
      daysOfWeek: [''],
    });
  }

  private displayValidationErrors() {

  }
}
