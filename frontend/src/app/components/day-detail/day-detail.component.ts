import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ModalController, NavParams, PopoverController} from '@ionic/angular';
import {AppointmentVm} from '../../app.api';
import {DateInfo} from '../../appointment/dateInfo';
import {AppointmentEditPage} from '../../appointment/appointment-edit/appointment-edit.page';

@Component({
  selector: 'app-day-detail',
  templateUrl: './day-detail.component.html',
  styleUrls: ['./day-detail.component.scss'],
})
export class DayDetailComponent implements OnInit {
  targetDay: DateInfo;
  formattedDay: string;
  currentEvents: AppointmentVm[] = [];

  constructor(public popoverController: PopoverController,
              public modalController: ModalController,
              public navParams: NavParams) { }

  ngOnInit() {
    this.targetDay = this.navParams.get('target');
    const allEvents = this.navParams.get('events');
    this.formattedDay = this.getDayOfWeek(this.targetDay.date);
    this.currentEvents = allEvents.filter((event: AppointmentVm) => {
      if (event.start) {
        if (event.start.getDate() <= this.targetDay.date.getDate()
            && event.end.getDate() >= this.targetDay.date.getDate() ) {
          return true;
        }
      } else if (event.startRecur) {
        if (this.isDayContained(event.daysOfWeek) &&
            event.startRecur.getMilliseconds() <= this.targetDay.date.getMilliseconds()
            && event.endRecur.getMilliseconds() >= this.targetDay.date.getMilliseconds() ) {
          return true;
        }
      }
      return false;
    });
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


  isDayContained(weekArray: number[]): boolean {
    const day = this.targetDay.date.getDay();
    return weekArray.map(Number).indexOf(day) >= 0;
  }

  formatTime(time: string): string {
    const array: string[] = time.split(':');
    return array[0] + ':' + array[1];
  }

  getTime(date: Date): string {
    const datetext = date.toTimeString().split(' ');
    return this.formatTime(datetext[0]);
  }
}
