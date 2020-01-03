import { Component, OnInit } from '@angular/core';
import {AlertController, ModalController, NavParams} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppointmentVm, UserClient, UserVmRole} from '../../app.api';

@Component({
  selector: 'app-appointment-edit',
  templateUrl: './appointment-edit.page.html',
  styleUrls: ['./appointment-edit.page.scss'],
})
export class AppointmentEditPage implements OnInit {

  private form: FormGroup;
  private appointments: AppointmentVm[];
  private selectedAppointment: AppointmentVm;
  private editorUser: boolean;
  private editMode: boolean;
  private global: boolean;
  private allDay: boolean;

  constructor(private navParams: NavParams,
              private formBuilder: FormBuilder,
              public modalController: ModalController,
              private userClient: UserClient,
              private alertController: AlertController) {
  }

  ngOnInit() {
    this.initForm();
    this.appointments = this.navParams.get('appointments');
    this.selectedAppointment = this.getSelectedAppointment();
    this.editorUser = this.isEditorUser();
    this.editMode = false;
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

  toggleEdit() {
    this.editMode = !this.editMode;
  }

  getSelectedAppointment() {
    const selectedItemTitle = this.navParams.get('selected');
    return this.appointments.find((appointment) => appointment.title === selectedItemTitle);
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

  toggleGlobal() {
    this.global = !this.global;
  }

  toggleAllDay() {
    this.allDay = !this.allDay;
  }

  private initForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      content: [''],
      start: [''],
      end: [''],
      startTime: [''],
      endTime: [''],
      allDay: [''],
      daysOfWeek: [''],
      backgroundColor: [''],
      global: ['']
    });
  }

  onSubmit() {

  }
}
