import { Component, OnInit } from '@angular/core';
import {NavParams, PopoverController} from '@ionic/angular';
import {AppointmentVm} from '../../app.api';
import {DateInfo} from '../../appointment/dateInfo';

@Component({
  selector: 'app-day-detail',
  templateUrl: './day-detail.component.html',
  styleUrls: ['./day-detail.component.scss'],
})
export class DayDetailComponent implements OnInit {
  targetDay: DateInfo;
  currentEvents: AppointmentVm[] = [];

  constructor(public popoverController: PopoverController,
              public navParams: NavParams) { }

  ngOnInit() {
    this.targetDay = this.navParams.get('target');
    const allEvents = this.navParams.get('events');
    this.currentEvents = allEvents.filter((event: AppointmentVm) => {
      if (event.start) {
        if (event.start.getDate() <= this.targetDay.date.getDate()
            && event.end.getDate() >= this.targetDay.date.getDate() ) {
          return true;
        }
      } else if (event.startRecur) {
        if (event.daysOfWeek.includes(this.targetDay.date.getDay().toString(10)) &&
            event.startRecur.getDate() <= this.targetDay.date.getDate()
            && event.endRecur.getDate() >= this.targetDay.date.getDate() ) {
          return true;
        }
      }
      return false;
    });
  }

  setStatus(event: any) {
    this.popoverController.dismiss();
  }

}
