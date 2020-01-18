import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild} from '@angular/core';
import {AlertController, LoadingController, MenuController, ModalController, PopoverController} from '@ionic/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import bootstrapPlugin from '@fullcalendar/bootstrap';
import {AppointmentClient, AppointmentVm, TodoVm, UserClient, UserVmRole} from '../app.api';
import {FullCalendarComponent} from '@fullcalendar/angular';
import {Router} from '@angular/router';
import {AppointmentCreationPage} from '../appointment/appointment-creation/appointment-creation.page';
import {AppointmentEditPage} from '../appointment/appointment-edit/appointment-edit.page';
import * as $ from 'jquery';
import {DayDetailComponent} from '../components/day-detail/day-detail.component';
import {DateInfo} from '../appointment/dateInfo';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterViewInit {

    @ViewChild('monthCalendar', {static: false}) monthCalendar: FullCalendarComponent;

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
        left:   'listWeek timeGridWeek dayGridMonth',
        center: '',
        right: 'prev next'
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
    lastPanAction: any;

    constructor(public menuController: MenuController,
                private userClient: UserClient,
                private appointmentClient: AppointmentClient,
                private router: Router,
                private alertController: AlertController,
                private modalController: ModalController,
                private popoverController: PopoverController,
                private loadingController: LoadingController) {
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
            $('.fc-day.fc-today').eq(0).siblings().addClass('fc-today');
            $('.fc-listWeek-button, .fc-dayGridWeek-button, .fc-dayGridMonth-button, .fc-prev-button, .fc-next-button')
                .click( () => {
                this.titleName = calenderApi.view.title;
            });

            $('.fc-dayGridMonth-button').click(() => {
                $('.fc-day.fc-today').eq(0).siblings().addClass('fc-today');
            });

        });

        const calenderApi = this.monthCalendar.getApi();
        this.titleName = calenderApi.view.title;
    }

    async presentLoadingWithOptions() {
        this.getEvents();
        const loading = await this.loadingController.create({
            duration: 2000,
            message: 'Synchronisiere...'
        });
        return await loading.present();
    }

    async showDateClick(ev: any) {
        const events = this.calendarEvents.filter((event: AppointmentVm) => {
            return this.isRelevantEvent(event, ev);
        });

        if (events.length > 0) {
            const editor = this.editorUser;
            const popover = await this.popoverController.create({
                component: DayDetailComponent,
                event: ev,
                animated: true,
                showBackdrop: true,
                componentProps: {target: ev, events, editorUser: editor}
            });
            return await popover.present();
        }
    }

    private isRelevantEvent(event: AppointmentVm, ev: any) {
        if (event.start) {
            if (event.start.getDate() <= ev.date.getDate()
                && event.end.getDate() >= ev.date.getDate()) {
                return true;
            }
        } else if (event.startRecur) {
            if (this.isDayContained(event.daysOfWeek, ev) &&
                event.startRecur.getMilliseconds() <= ev.date.getMilliseconds()
                && event.endRecur.getMilliseconds() >= ev.date.getMilliseconds()) {
                return true;
            }
        }
        return false;
    }

    getEvents() {
        this.appointmentClient.getAll()
            .subscribe((appointments: AppointmentVm[]) => {
                this.calendarEvents = appointments;
            });
    }

    async eventClick($event: any) {
        const editor = this.editorUser;
        const eventView = await this.modalController.create(
            {
                component: AppointmentEditPage,
                componentProps: {appointments: this.calendarEvents, selected: $event.event.title, editorUser: editor}
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
                componentProps: {appointments: this.calendarEvents, calender: this.monthCalendar}
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

    onPanLeft($event) {
        console.log('panLeft');
        this.lastPanAction = $event;
    }

    onPanRight($event) {
        console.log('panRight');
        this.lastPanAction = $event;
    }

    onPanEnd($event) {
        console.log('panEnd');
        const fcApi = this.monthCalendar.getApi();
        switch (this.lastPanAction.additionalEvent) {
            case 'panright':
                fcApi.prev();
                this.titleName = fcApi.view.title;
                if (fcApi.view.type === 'dayGridMonth') {
                    $('.fc-day.fc-today').eq(0).siblings().addClass('fc-today');
                }
                break;
            case 'panleft':
                fcApi.next();
                this.titleName = fcApi.view.title;
                if (fcApi.view.type === 'dayGridMonth') {
                    $('.fc-day.fc-today').eq(0).siblings().addClass('fc-today');
                }
                break;
        }
    }

    datesRender($event) {
        console.log($event.view.activeStart, $event.view.activeEnd, $event);
        // this.RefreshPage();
    }

    isDayContained(weekArray: number[], targetDay: DateInfo): boolean {
        const day = targetDay.date.getDay();
        return weekArray.map(Number).indexOf(day) >= 0;
    }
}
