import { Component, OnInit } from '@angular/core';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-appointment-creation',
  templateUrl: './appointment-creation.page.html',
  styleUrls: ['./appointment-creation.page.scss'],
})
export class AppointmentCreationPage implements OnInit {

  constructor(public modalController: ModalController) { }

  ngOnInit() {
  }

  public async dismiss() {
    this.modalController.dismiss({
      dismissed: true
    });
  }
}
