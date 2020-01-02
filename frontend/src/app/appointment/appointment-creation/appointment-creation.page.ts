import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppointmentClient, AppointmentParams, AppointmentVm} from '../../app.api';
import * as moment from 'moment';
import {Moment} from 'moment';
import * as $ from 'jquery';

@Component({
    selector: 'app-appointment-creation',
    templateUrl: './appointment-creation.page.html',
    styleUrls: ['./appointment-creation.page.scss'],
})
export class AppointmentCreationPage implements OnInit, AfterViewInit {

    private form: FormGroup;
    private appointments: AppointmentVm[];
    private allDay: boolean;
    private minDate: string;
    private maxDate: string;
    private monthNames = 'Jan, Feb, Mar, Apr, Mai, Jun, Jul, Aug, Sep, Oct, Nov, Dec';
    private minuteValues = '0,5,10,15,20,25,30,35,40,45,50,55';
    private global: boolean;

    constructor(public modalController: ModalController,
                private formBuilder: FormBuilder,
                private params: NavParams,
                private appointmentClient: AppointmentClient) {
    }

    ngOnInit() {
        this.initForm();
        this.allDay = false;
        this.global = true;
        const now: Moment = moment();
        this.minDate = (now).toISOString();
        const newDate = moment(now).add(1, 'year');
        this.maxDate = newDate.toISOString();
    }

    public async dismiss() {
        this.modalController.dismiss({
            dismissed: true
        });
    }

    onSubmit() {
        this.setStandardValues();

        if (this.form.invalid) {
            this.displayValidationErrors();
            return;
        }

        const appointmentParams: AppointmentParams = new AppointmentParams(this.form.value);
        this.appointmentClient.create(appointmentParams)
            .subscribe((newAppointment: AppointmentVm) => {
                this.appointments = [newAppointment, ...this.appointments];
                this.form.get('title').reset();
                this.form.get('content').reset();
                this.form.get('start').reset();
                this.form.get('end').reset();
                this.form.get('startTime').reset();
                this.form.get('endTime').reset();
                this.form.get('allDay').reset();
                this.form.get('daysOfWeek').reset();
                this.form.get('backgroundColor').reset();
                this.form.get('global').reset();
            });

        this.dismiss();
    }

    private setStandardValues() {
        if (this.form.get('start').value === '') {
            this.form.get('start').setValue(this.minDate);
        }
        if (this.form.get('end').value === '') {
            this.form.get('end').setValue(this.minDate);
        }
        if (this.form.get('startTime').value === '' && this.form.get('allDay').value === '') {
            this.form.get('startTime').setValue(this.minDate);
        }
        if (this.form.get('endTime').value === '' && this.form.get('allDay').value === '') {
            this.form.get('endTime').setValue(this.minDate);
        }
        this.form.get('global').setValue(this.global);
        this.form.get('allDay').setValue(this.allDay);
    }


    private initForm() {
        this.form = this.formBuilder.group({
            title: ['', Validators.required],
            content: [''],
            start: ['', Validators.required],
            end: ['', Validators.required],
            startTime: [''],
            endTime: [''],
            allDay: [''],
            daysOfWeek: [''],
            backgroundColor: [''],
            global: ['']
        });
    }

    private displayValidationErrors() {
    }

    toggleAllDay() {
        this.allDay = !this.allDay;
    }

    toggleGlobal() {
        this.global = !this.global;
    }

    ngAfterViewInit(): void {
        $(document).ready(() => {
            $('.item-inner').addClass('no-border');
        });
    }
}
