import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {AlertController, MenuController, ModalController} from '@ionic/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import {UserClient, UserVmRole} from '../app.api';
import {FullCalendarComponent} from '@fullcalendar/angular';
import {Router} from '@angular/router';
import {AppointmentCreationPage} from '../appointment/appointment-creation/appointment-creation.page';
import {AppointmentEditPage} from '../appointment/appointment-edit/appointment-edit.page';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {

    @ViewChild('monthCalendar', {static: false}) monthCalendar: FullCalendarComponent;
    @ViewChild('dayListCalendar', {static: true}) dayListCalendar: FullCalendarComponent;

    editorUser: boolean;
    defaultView: string;
    calendarPlugins = [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin, bootstrapPlugin];
    calendarEvents = [
        {title: 'Meeting', date: '2019-12-15'},
        {title: 'event 2', daysOfWeek: [3], startRecur: '2019-12-18', endRecur: '2020-01-05', allDay: true},
        {title: 'event 3', date: '2019-12-13'}
    ];
    header = {
        left:   'timeGridWeek dayGridMonth',
        center: 'title',
        right:  'prev next'
    };
    showList: boolean;

    constructor(public menuController: MenuController,
                private userClient: UserClient,
                private router: Router,
                private alertController: AlertController,
                private modalController: ModalController) {
        this.menuController.enable(true, 'mainMenu');
    }

    ngOnInit(): void {
        this.defaultView = 'dayGridMonth';
        this.showList = true;
    }

    ngAfterViewInit(): void {
        this.editorUser = this.isEditorUser();
    }

    showDateClick(day: any) {
        const calendarApi = this.dayListCalendar.getApi();
        if (this.monthCalendar.getApi().view.type !== 'timeGridWeek') {
            calendarApi.render();
            calendarApi.gotoDate(day.date);
        } else {
            calendarApi.destroy();
        }
    }

    getEvents() {
        return this.calendarEvents;
    }

    async eventClick($event: any) {
        return await this.modalController.create(
            {
                component: AppointmentEditPage,
                componentProps: {appointments: this.calendarEvents, selected: $event}
            });
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
        return await this.modalController.create(
            {
                component: AppointmentCreationPage,
                componentProps: {appointments: this.calendarEvents}
            });
    }

    private async upgradeAlert() {
        return await this.alertController.create({
            header: 'Upgrade benötigt',
            message: 'Möchten Sie Ihren Account upgraden um Aufgaben zu erstellen?',
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
