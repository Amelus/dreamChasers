import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CloudStoragePage } from './cloud-storage.page';

const routes: Routes = [
  {
    path: '',
    component: CloudStoragePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CloudStoragePage]
})
export class CloudStoragePageModule {}
