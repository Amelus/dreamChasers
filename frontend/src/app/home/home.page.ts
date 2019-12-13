import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MenuController} from '@ionic/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import {UserClient, UserVmRole} from '../app.api';
import {FullCalendarComponent} from '@fullcalendar/angular';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {

    @ViewChild('calendarComponent', {static: false}) calendarComponent: FullCalendarComponent;

    editorUser: boolean;
    calendarPlugins = [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin, bootstrapPlugin];
    calendarEvents = [
        {title: 'event 1', date: '2019-12-15'},
        {title: 'event 2', date: '2019-12-18'}
    ];
    selectedEvent: any;

    constructor(public menuController: MenuController,
                private userClient: UserClient) {
        this.menuController.enable(true, 'mainMenu');
    }

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.editorUser = this.isEditorUser();
    }

    addEvent() {
        this.calendarEvents = this.calendarEvents.concat({title: 'event 3', date: '2019-12-22'});
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


    addAppointmentModal() {
        // trigger modal
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

    showDateClick($event: any) {
        const calendarApi = this.calendarComponent.getApi();
        calendarApi.gotoDate($event.date);
    }
}
