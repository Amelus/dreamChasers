import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';

import {StatusChangeComponent} from './status-change/status-change.component';
import {DayDetailComponent} from './day-detail/day-detail.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule
    ],
    exports: [
        StatusChangeComponent,
        DayDetailComponent
    ],
    declarations: [StatusChangeComponent, DayDetailComponent],
    entryComponents: [StatusChangeComponent, DayDetailComponent]
})
export class CustomComponentModule {
}
