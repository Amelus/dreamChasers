import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {IonicModule} from '@ionic/angular';

import {MindMapPage} from './mind-map.page';
import {TreeModule} from 'primeng';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BrowserModule} from '@angular/platform-browser';

const routes: Routes = [
  {
    path: '',
    component: MindMapPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    TreeModule
  ],
  declarations: [MindMapPage]
})
export class MindMapPageModule {}
