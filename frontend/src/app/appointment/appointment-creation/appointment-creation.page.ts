import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AppointmentClient, AppointmentVm} from '../../app.api';

@Component({
  selector: 'app-appointment-creation',
  templateUrl: './appointment-creation.page.html',
  styleUrls: ['./appointment-creation.page.scss'],
})
export class AppointmentCreationPage implements OnInit {

  private form: FormGroup;
  private appointments: AppointmentVm[];
  private recurring: boolean;
  private allDay: boolean;
  private minDate: Date;
  private maxDate: Date;

  constructor(public modalController: ModalController,
              private formBuilder: FormBuilder,
              private params: NavParams,
              private appointmentClient: AppointmentClient) { }

  ngOnInit() {
    this.recurring = false;
    this.allDay = false;
    this.minDate = new Date();
    this.maxDate.setDate(this.minDate.getDate() + 365);
  }

  public async dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

    onSubmit() {

    }

  toggleRecur() {
    this.recurring = !this.recurring;
  }

  toggleAllDay() {
    this.allDay = !this.allDay;
  }
}
