import {Component, OnInit} from '@angular/core';
import {AlertController, ModalController, NavParams, PopoverController} from '@ionic/angular';
import {AppointmentVm} from '../../app.api';
import {DateInfo} from '../../appointment/dateInfo';
import {AppointmentEditPage} from '../../appointment/appointment-edit/appointment-edit.page';
import {AppointmentCreationPage} from '../../appointment/appointment-creation/appointment-creation.page';
import {Router} from '@angular/router';

@Component({
  selector: 'app-day-detail',
  templateUrl: './day-detail.component.html',
  styleUrls: ['./day-detail.component.scss'],
})
export class DayDetailComponent implements OnInit {
  targetDay: DateInfo;
  formattedDay: string;
  currentEvents: AppointmentVm[] = [];
  editorUser: boolean;

  constructor(public popoverController: PopoverController,
              public modalController: ModalController,
              private router: Router,
              private alertController: AlertController,
              public navParams: NavParams) { }

  ngOnInit() {
    this.targetDay = this.navParams.get('target');
    this.currentEvents =  this.navParams.get('events');
    this.editorUser = this.navParams.get('editorUser');
    this.formattedDay = this.getDayOfWeek(this.targetDay.date);
  }

  dismiss() {
    this.popoverController.dismiss();
  }

  async eventClick(item: any) {
    const eventView = await this.modalController.create(
        {
          component: AppointmentEditPage,
          componentProps: {appointments: this.currentEvents, selected: item.title}
        });
    (await eventView).present();
  }

  getDayOfWeek(date: Date) {
    const dayOfWeek = date.getDay();
    if (isNaN(dayOfWeek)) {
      return null;
    }
    const day = ['So.', 'Mo.', 'Di.', 'Mi.', 'Do.', 'Fr.', 'Sa.'][dayOfWeek];
    return day + ', ' + date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
  }

  formatTime(time: string): string {
    const array: string[] = time.split(':');
    return array[0] + ':' + array[1];
  }

  getTime(date: Date): string {
    const datetext = date.toTimeString().split(' ');
    return this.formatTime(datetext[0]);
  }

  async triggerAlert() {
    let alert: any;
    if (this.editorUser) {
      alert = this.createAppointment();
    } else {
      alert = this.upgradeAlert();
    }
    (await alert).present();
  }

  private async createAppointment() {
    this.dismiss();
    return await this.modalController.create(
        {
          component: AppointmentCreationPage,
          componentProps: {appointments: this.currentEvents}
        });
  }

  private async upgradeAlert() {
    return await this.alertController.create({
      header: 'Upgrade benötigt',
      message: 'Möchten Sie Ihren Account upgraden um Termine zu erstellen?',
      buttons: [
        {
          text: 'Abbruch',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Upgrade',
          cssClass: 'primary',
          handler: () => {
            this.router.navigate(['/profile']);
          }
        }
      ]
    });
  }
}
