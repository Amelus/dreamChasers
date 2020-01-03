import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';

import {HomePage} from './home.page';
import {FullCalendarModule} from '@fullcalendar/angular';
import {AppointmentCreationPageModule} from '../appointment/appointment-creation/appointment-creation.module';
import {AppointmentEditPageModule} from '../appointment/appointment-edit/appointment-edit.module';
import {CustomComponentModule} from '../components/custom-component.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        AppointmentCreationPageModule,
        AppointmentEditPageModule,
        CustomComponentModule,
        RouterModule.forChild([
            {
                path: '',
                component: HomePage
            }
        ]),
        FullCalendarModule
    ],
    declarations: [HomePage]
})
export class HomePageModule {
}
