import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-status-change',
  templateUrl: './status-change.component.html',
  styleUrls: ['./status-change.component.scss'],
})
export class StatusChangeComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

  messages(ev) {
    console.log('you clicked something');
  }

}
