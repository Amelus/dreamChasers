import {Component, OnInit} from '@angular/core';
import {MenuController} from '@ionic/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  calendarPlugins = [dayGridPlugin, timeGridPlugin, interactionPlugin];
  calendarEvents = [
    { title: 'event 1', date: '2019-12-15' },
    { title: 'event 2', date: '2019-12-18' }
  ];

  constructor(public menuController: MenuController) {
    this.menuController.enable(true, 'mainMenu');
  }

  addEvent() {
    this.calendarEvents = this.calendarEvents.concat({ title: 'event 3', date: '2019-12-22' });
  }

   modifyTitle(eventIndex, newTitle) {
    const calendarEvents = this.calendarEvents.slice(); // a clone
    const singleEvent = Object.assign({}, calendarEvents[eventIndex]); // a clone
    singleEvent.title = newTitle;
    calendarEvents[eventIndex] = singleEvent;
    this.calendarEvents = calendarEvents; // reassign the array
  }

  handleDateClick($event: any) {
    console.log('click');
    alert($event.dateStr);
  }

  ngOnInit(): void {
  }
}
