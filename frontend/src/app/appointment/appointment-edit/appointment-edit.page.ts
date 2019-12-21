import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {FormGroup} from '@angular/forms';
import {UserClient, UserVmRole} from '../../app.api';

@Component({
  selector: 'app-appointment-edit',
  templateUrl: './appointment-edit.page.html',
  styleUrls: ['./appointment-edit.page.scss'],
})
export class AppointmentEditPage implements OnInit {

  private form: FormGroup;
  private appointments;
  private selectedAppointment;
  private editorUser: boolean;

  constructor(private navParams: NavParams,
              public modalController: ModalController,
              private userClient: UserClient) {
  }

  ngOnInit() {
    this.appointments = this.navParams.get('appointments');
    this.selectedAppointment = this.getSelectedAppointment();
    this.editorUser = this.isEditorUser();
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

  getSelectedAppointment() {
    let selectedItemTitle = this.navParams.get('selected');
    return this.appointments.find((appointment) => {return appointment.title === selectedItemTitle; });
  }

  private isEditorUser(): boolean {
    if (!this.userClient.getSessionUser()
        || this.userClient.getSessionUser() === undefined
        || this.userClient.getSessionUser() === null) {
      return false;
    }

    return !(this.userClient.getSessionUser().role === undefined
        || this.userClient.getSessionUser().role === null
        || this.userClient.getSessionUser().role === UserVmRole.User);

  }
}
