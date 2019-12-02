import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {RouterModule} from '@angular/router';

import {ListPage} from './list.page';
import {TodoCreationPageModule} from '../todo-creation/todo-creation.module';
import {CustomComponentModule} from '../components/custom-component.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        CustomComponentModule,
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
    declarations: [ListPage],
    entryComponents: []
})
export class ListPageModule {
}
