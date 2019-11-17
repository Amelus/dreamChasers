import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {LogoutPage} from './logout.page';

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: '',
                component: LogoutPage
            }
        ])
    ],
    declarations: [LogoutPage]
})
export class LogoutPageModule {
}
