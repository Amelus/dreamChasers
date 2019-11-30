import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';

import {ListPage} from './list.page';
import {StatusChangeComponent} from '../components/status-change/status-change.component';
import {UpgradeAlertComponent} from '../components/upgrade-alert/upgrade-alert.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild([
            {
                path: '',
                component: ListPage
            }
        ])
    ],
    exports: [
        ListPage
    ],
    declarations: [ListPage, StatusChangeComponent, UpgradeAlertComponent],
    entryComponents: [StatusChangeComponent, UpgradeAlertComponent]
})
export class ListPageModule {
}
