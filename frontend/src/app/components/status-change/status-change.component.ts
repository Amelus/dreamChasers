import { Component, OnInit } from '@angular/core';
import {NavParams, PopoverController} from '@ionic/angular';
import {TodoClient, TodoVm, TodoVmStatus} from '../../app.api';

@Component({
  selector: 'app-status-change',
  templateUrl: './status-change.component.html',
  styleUrls: ['./status-change.component.scss'],
})
export class StatusChangeComponent implements OnInit {
  myStatus = TodoVmStatus;

  constructor(public popoverController: PopoverController,
              public navParams: NavParams,
              private todoClient: TodoClient) { }

  ngOnInit() {}

  setStatus(status: TodoVmStatus) {
    const target: TodoVm = this.navParams.get('target');
    target.status = status;
    this.todoClient.update(target).subscribe();
    this.popoverController.dismiss();
  }

}
