import { Component, OnInit } from '@angular/core';
import {AlertController} from '@ionic/angular';

@Component({
  selector: 'app-upgrade-alert',
  templateUrl: './upgrade-alert.component.html',
  styleUrls: ['./upgrade-alert.component.scss'],
})
export class UpgradeAlertComponent implements OnInit {

  constructor(public alertController: AlertController) {}

  ngOnInit() {}

}
