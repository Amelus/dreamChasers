import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';

import {ListPage} from './list.page';
import {StatusChangeComponent} from '../components/status-change/status-change.component';
import {TodoCreationPageModule} from '../todo-creation/todo-creation.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        TodoCreationPageModule,
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
    declarations: [ListPage, StatusChangeComponent],
    entryComponents: [StatusChangeComponent]
})
export class ListPageModule {
}
