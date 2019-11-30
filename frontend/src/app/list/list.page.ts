import {Component, OnInit, Renderer2} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TodoClient, TodoParams, TodoVm, UserClient, UserVmRole} from '../app.api';
import {PopoverController} from '@ionic/angular';
import {StatusChangeComponent} from '../components/status-change/status-change.component';

@Component({
    selector: 'app-list',
    templateUrl: 'list.page.html',
    styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
    form: FormGroup;
    todos: TodoVm[] = [];
    editableCache = {};
    editorUser: boolean;

    availableStatuses = [];

    constructor(private formBuilder: FormBuilder,
                private todoClient: TodoClient,
                public popoverController: PopoverController,
                private renderer: Renderer2,
                private userClient: UserClient) {
    }

    ngOnInit() {
        this.initForm();
        this.getTodos();
        this.getAvailableStatuses();

        this.editorUser = this.userClient.getSessionUser() && this.userClient.getSessionUser().role !== UserVmRole.User;
    }

    private getTodos() {
        this.todoClient.getAssigned() // replace with user from jwc token
            .subscribe((todos: TodoVm[]) => {
                this.todos = todos;
                this.updateEditableCache();
            });
    }

    expandItem(event, index) {
        const element = event.target;
        this.todos[index].isCompleted = !this.todos[index].isCompleted;
        const panel = this.renderer.nextSibling(element);
        if (panel !== null) {
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + 'px';
            }
        }
    }

    async changeStatus(ev: any, target: TodoVm) {
        const popover = await this.popoverController.create({
            component: StatusChangeComponent,
            event: ev,
            animated: true,
            showBackdrop: true,
            componentProps: {target}
        });
        return await popover.present();
    }

    createTodo() {
        console.log("Forward to creation page");
    }

    alertUpgrade() {
        console.log("Upgrade needed");
    }

    // ----- keep logic for calender edit appointment --------

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
                this.form.get('status').setValue('Pending');
            });
    }

    public updateEditableCache() {
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
        this.availableStatuses = ['Finished', 'Pending'];
    }

    private initForm() {
        this.form = this.formBuilder.group({
            content: ['', Validators.required],
            status: 'Pending',
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
