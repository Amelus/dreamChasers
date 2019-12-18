import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from '@ionic/angular';
import {TodoClient, TodoParams, TodoVm, UserClient, UserVm} from '../app.api';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import {Moment} from 'moment';


@Component({
  selector: 'app-todo-creation',
  templateUrl: './todo-creation.page.html',
  styleUrls: ['./todo-creation.page.scss'],
})
export class TodoCreationPage implements OnInit {

  private form: FormGroup;
  private todos: TodoVm[];
  private assignees: UserVm[];
  private minDate: string;
  private maxDate: string;

  constructor(public modalController: ModalController,
              private formBuilder: FormBuilder,
              private todoClient: TodoClient,
              private params: NavParams,
              private userClient: UserClient) { }

  ngOnInit() {
    this.todos = this.params.get('todos');
    this.initForm();
    this.getAssignableUsers();
    const now: Moment = moment();
    this.minDate = (now).toISOString();
    const newDate = moment(now).add(1, 'year');
    this.maxDate = newDate.toISOString();
  }

  onSubmit() {
    if (this.form.invalid) {
      this.displayValidationErrors();
      return;
    }

    const todoParams: TodoParams = new TodoParams(this.form.value);
    this.todoClient.create(todoParams)
        .subscribe((newTodo: TodoVm) => {
          this.todos = [newTodo, ...this.todos];
          this.form.get('assignee').reset();
          this.form.get('title').reset();
          this.form.get('content').reset();
          this.form.get('dueDate').reset();
        });
    this.dismiss();
  }

  private initForm() {
    this.form = this.formBuilder.group({
      assignee: ['', Validators.required],
      title: ['', Validators.required],
      content: ['', Validators.required],
      dueDate: ['', Validators.required],
    });
  }

  private displayValidationErrors() {
    const formKeys = Object.keys(this.form.controls);
    formKeys.forEach(key => {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
    });
  }

  dismiss() {
    // using the injected ModalController this page
    // can "dismiss" itself and optionally pass back data
    this.modalController.dismiss({
      dismissed: true
    });
  }

  private getAssignableUsers() {
    this.userClient.getAssignees().subscribe(
        (assignees: UserVm[]) => {
          this.assignees = assignees;
        }
    );
  }

}
