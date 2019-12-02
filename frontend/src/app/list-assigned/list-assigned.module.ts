import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ListAssignedPage } from './list-assigned.page';
import {CustomComponentModule} from '../components/custom-component.module';

const routes: Routes = [
  {
    path: '',
    component: ListAssignedPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomComponentModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ListAssignedPage]
})
export class ListAssignedPageModule {}
