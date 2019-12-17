import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-appointment-edit',
  templateUrl: './appointment-edit.page.html',
  styleUrls: ['./appointment-edit.page.scss'],
})
export class AppointmentEditPage implements OnInit {

  private form: FormGroup;
  private appointments;
  private selectedAppointment;

  constructor(private navParams: NavParams,
              public modalController: ModalController) {
  }

  ngOnInit() {
    this.appointments = this.navParams.get('appointments');
    this.selectedAppointment = this.navParams.get('selected');
  }

  modifyTitle(eventIndex, newTitle) {
    const calendarEvents = this.appointments.slice(); // a clone
    const singleEvent = Object.assign({}, calendarEvents[eventIndex]); // a clone
    singleEvent.title = newTitle;
    calendarEvents[eventIndex] = singleEvent;
    this.appointments = calendarEvents; // reassign the array
  }

  public async dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }

}
