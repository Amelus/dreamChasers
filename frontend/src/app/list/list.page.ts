import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TodoClient, TodoParams, TodoVm } from '../app.api';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  private selectedItem: any;
  form: FormGroup;
  todos: TodoVm[] = [];
  editableCache = {};

  availableStatuses = [];

  constructor(private formBuilder: FormBuilder,
              private todoClient: TodoClient) { }

  ngOnInit() {
    this.initForm();
    this.getTodos();
    this.getAvailableStatuses();
  }

  onStatusChanged(isCompleted: boolean, todoVm: TodoVm) {
    todoVm.isCompleted = isCompleted;
    this.todoClient.update(todoVm)
        .subscribe((updatedTodo: TodoVm) => {
          const index = this.todos.findIndex(todo => todo.id === updatedTodo.id);
          this.todos.splice(index, 1, updatedTodo);
          this.updateEditableCache();
        });
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
          this.updateEditableCache();
          this.form.get('content').reset();
          this.form.get('status').reset();
          this.form.get('status').setValue('InProgress');
        });
  }

  private updateEditableCache() {
    this.todos.forEach(todo => {
      if (!this.editableCache[todo.id]) {
        this.editableCache[todo.id] = {};
      }

      Object.keys(todo).forEach(key => {
        this.editableCache[todo.id][key] = {
          data: todo[key],
          edit: false,
        };
      });
    });
  }

  private getAvailableStatuses() {
    this.availableStatuses = ['Finished', 'InProgress'];
  }

  private getTodos() {
    this.todoClient.getall() // replace with user from jwc token
        .subscribe((todos: TodoVm[]) => {
          this.todos = todos;
          this.updateEditableCache();
        });
  }

  private initForm() {
    this.form = this.formBuilder.group({
      content: ['', Validators.required],
      status: 'InProgress',
    });
  }

  private displayValidationErrors() {
    const formKeys = Object.keys(this.form.controls);
    formKeys.forEach(key => {
      this.form.controls[key].markAsDirty();
      this.form.controls[key].updateValueAndValidity();
    });
  }

  finishEdit(todo: TodoVm, key: string) {
    todo[key] = this.editableCache[todo.id][key].data;
    this.todoClient.update(todo)
        .subscribe((updated: TodoVm) => {
          const index = this.todos.findIndex(t => t.id === updated.id);
          this.todos.splice(index, 1, updated);
          this.updateEditableCache();
        });
  }

  startEdit(todo: TodoVm, key: string) {
    this.editableCache[todo.id][key].edit = true;
  }
}
