import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {AlertController, MenuController, ModalController} from '@ionic/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import {AppointmentClient, AppointmentVm, UserClient, UserVmRole} from '../app.api';
import {FullCalendarComponent} from '@fullcalendar/angular';
import {Router} from '@angular/router';
import {AppointmentCreationPage} from '../appointment/appointment-creation/appointment-creation.page';
import {AppointmentEditPage} from '../appointment/appointment-edit/appointment-edit.page';
import * as $ from 'jquery';

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
    calendarEvents: AppointmentVm[] = [];
    customButtons = {
        myCustomButton: {
            text: '+',
            click: () => {
                this.triggerAlert();
            }
        }
    };
    header = {
        left:   'listWeek,timeGridWeek,dayGridMonth',
        center: '',
        right: 'prev,next'
    };
    buttonText = {
        today:    'Heute',
        month:    'Monat',
        week:     'Woche',
        list:     'Liste'
    };
    showList: boolean;
    themeSystem: string;
    height: number;
    titleName: string;

    constructor(public menuController: MenuController,
                private userClient: UserClient,
                private appointmentClient: AppointmentClient,
                private router: Router,
                private alertController: AlertController,
                private modalController: ModalController) {
        this.menuController.enable(true, 'mainMenu');
    }

    ngOnInit(): void {
        this.defaultView = 'dayGridMonth';
        this.showList = true;
        this.getEvents();
        this.height = window.innerHeight * 0.9;
        console.log('height: ' + this.height);
        this.titleName = 'Kalender';
    }

    ngAfterViewInit(): void {
        this.editorUser = this.isEditorUser();

        if (document.body.classList.contains('dark')) {
            this.themeSystem = 'bootstrap';
        } else {
            this.themeSystem = 'standard';
        }

        $(document).ready(() => {
            $('.fc-day-top.fc-today').eq(0).addClass('now-indic');
            $('.fc-day.fc-today').eq(0).siblings().addClass('fc-today');
            $('.fc-listWeek-button, .fc-timeGridWeek-button, .fc-dayGridMonth-button, .fc-prev-button, .fc-next-button')
                .click( () => {
                this.titleName = calenderApi.view.title;
            });

        });

        const calenderApi = this.monthCalendar.getApi();
        this.titleName = calenderApi.view.title;
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
        this.appointmentClient.getAll()
            .subscribe((appointments: AppointmentVm[]) => {
                this.calendarEvents = appointments;
            });
    }

    async eventClick($event: any) {
        const eventView = await this.modalController.create(
            {
                component: AppointmentEditPage,
                componentProps: {appointments: this.calendarEvents, selected: $event.event.title}
            });
        (await eventView).present();
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
