import {AfterViewInit, Component, OnInit, Renderer2} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TodoClient, TodoParams, TodoVm, UserClient, UserVmRole} from '../app.api';
import {AlertController, ModalController, PopoverController} from '@ionic/angular';
import {StatusChangeComponent} from '../components/status-change/status-change.component';
import {TodoCreationPage} from '../todo-creation/todo-creation.page';

@Component({
    selector: 'app-list',
    templateUrl: 'list.page.html',
    styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit, AfterViewInit {
    form: FormGroup;
    todos: TodoVm[] = [];
    editorUser: boolean;
    editableCache = {};
    deletion: boolean;
    toDelete: TodoVm[] = [];

    availableStatuses = [];

    constructor(private formBuilder: FormBuilder,
                private todoClient: TodoClient,
                public popoverController: PopoverController,
                private renderer: Renderer2,
                private userClient: UserClient,
                private alertController: AlertController,
                public modalController: ModalController) {
    }

    ngOnInit() {
        this.initForm();
        this.getTodos();
        this.getAvailableStatuses();
        this.deletion = false;
    }

    ngAfterViewInit() {
        this.editorUser = this.isEditorUser();
    }

    doRefresh(event) {
        setTimeout(() => {
            this.getTodos();
            event.target.complete();
        }, 2000);
    }

    toggleDeletion() {
        this.deletion = !this.deletion;
        this.toDelete = [];
        this.todos.map((todo: TodoVm) => {
            todo.isChecked = false;
            return todo;
        });
    }

    checkEvent(item: TodoVm) {
        if (this.toDelete.includes(item)) {
            const index = this.toDelete.indexOf(item);
            this.toDelete.splice(index, 1);
        } else {
            this.toDelete = [item, ...this.toDelete];
        }
    }

    async alertDeletion() {
        let alert: any;
        if (this.editorUser) {
            alert = this.deleteAlert();
        } else {
            alert = this.noPermission2DeleteAlert();
        }
        (await alert).present();
    }

    private getTodos() {
        this.todoClient.getCreated()
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

    async triggerAlert() {
        let alert: any;
        if (this.editorUser) {
            alert = this.createTodo();
        } else {
            alert = this.upgradeAlert();
        }
        (await alert).present();
    }

    private async createTodo() {
        return await this.modalController.create(
            {
                component: TodoCreationPage,
                componentProps: {todos: this.todos}
            });
    }

    private async upgradeAlert() {
        return await this.alertController.create({
            header: 'Upgrade benötigt',
            message: 'Möchten Sie Ihren Account upgraden um Aufgaben zu erstellen?',
            buttons: [
                {
                    text: 'Abbruch',
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: 'Upgrade',
                    cssClass: 'primary',
                    handler: () => {
                        console.log('Weiterleitung zum Upgrade');
                    }
                }
            ]
        });
    }

    private async deleteAlert() {
        return await this.alertController.create({
            header: 'Aufgaben löschen',
            message: 'Sind Sie sicher dass sie diese Aufgaben löschen möchten?',
            buttons: [
                {
                    text: 'Abbruch',
                    role: 'cancel',
                    cssClass: 'secondary'
                }, {
                    text: 'Löschen',
                    cssClass: 'primary',
                    handler: () => {
                        this.todoClient.delete(this.toDelete.map((todo) => {
                            return todo.id;
                        })).subscribe();
                    }
                }
            ]
        });
    }

    private async noPermission2DeleteAlert() {
        return await this.alertController.create({
            header: 'Keine Berechtigung',
            message: 'Sie besitzen keine Berechtigung um Aufgaben zu löschen',
            buttons: [
                {
                    text: 'OK',
                    role: 'cancel',
                    cssClass: 'secondary'
                }
            ]
        });
    }

    private isEditorUser(): boolean {
        if (!this.userClient.getSessionUser()
            || this.userClient.getSessionUser() === undefined
            || this.userClient.getSessionUser() === null) {
            return false;
        }

        return !(this.userClient.getSessionUser().role === undefined
            || this.userClient.getSessionUser().role === null
            || this.userClient.getSessionUser().role === UserVmRole.User);

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
