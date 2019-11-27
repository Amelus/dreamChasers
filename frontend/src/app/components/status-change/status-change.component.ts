import { Component, OnInit } from '@angular/core';
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-status-change',
  templateUrl: './status-change.component.html',
  styleUrls: ['./status-change.component.scss'],
})
export class StatusChangeComponent implements OnInit {

  constructor(public popoverController: PopoverController) { }

  ngOnInit() {}

  setStatus(ev) {
    console.log('you clicked something');
    this.popoverController.dismiss();
  }

}
