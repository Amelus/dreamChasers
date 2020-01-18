import { Component, OnInit } from '@angular/core';
import {AlertController, ModalController, NavParams} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppointmentClient, AppointmentVm, UserClient, UserVmRole} from '../../app.api';

@Component({
  selector: 'app-appointment-edit',
  templateUrl: './appointment-edit.page.html',
  styleUrls: ['./appointment-edit.page.scss'],
})
export class AppointmentEditPage implements OnInit {

  form: FormGroup;
   appointments: AppointmentVm[];
   selectedAppointment: AppointmentVm;
   editorUser: boolean;
   editMode: boolean;
   global: boolean;
   allDay: boolean;
   isCreator: boolean;

  constructor(private navParams: NavParams,
              private formBuilder: FormBuilder,
              public modalController: ModalController,
              private userClient: UserClient,
              private appointmentClient: AppointmentClient,
              private alertController: AlertController) {
  }

  ngOnInit() {
    this.initForm();
    this.appointments = this.navParams.get('appointments');
    this.selectedAppointment = this.getSelectedAppointment();
    this.editorUser = this.navParams.get('editorUser');
    this.editMode = false;
    this.global = this.selectedAppointment.extendedProps.global;
    this.allDay = this.selectedAppointment.allDay;
    const user = this.userClient.getSessionUser();
    this.isCreator = this.selectedAppointment.extendedProps.creator === user.username;
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

  async toggleEdit() {
    if (this.isCreator) {
      this.editMode = !this.editMode;
    } else {
      const alert = this.noPermission2DeleteAlert();
      (await alert).present();
    }
  }

  getSelectedAppointment() {
    const selectedItemTitle = this.navParams.get('selected');
    return this.appointments.find((appointment) => appointment.title === selectedItemTitle);
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

  async tryDelete() {
    const user = this.userClient.getSessionUser();
    let alert: any;
    if (this.selectedAppointment.extendedProps.creator === user.username) {
      alert = this.deleteAlert();
    } else {
      alert = this.noPermission2DeleteAlert();
    }
    (await alert).present();
  }

  private async deleteAlert() {
    return await this.alertController.create({
      header: 'Termin löschen',
      message: 'Sind Sie sicher dass sie diesen Termin löschen möchten?',
      buttons: [
        {
          text: 'Abbruch',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Löschen',
          cssClass: 'primary',
          handler: () => {
            this.appointmentClient.delete(this.selectedAppointment.id).subscribe();
          }
        }
      ]
    });
  }

  private async noPermission2DeleteAlert() {
    return await this.alertController.create({
      header: 'Keine Berechtigung',
      message: 'Sie besitzen keine Berechtigung um diesen Termin zu löschen',
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          cssClass: 'secondary'
        }
      ]
    });
  }
}
