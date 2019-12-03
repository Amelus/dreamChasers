import {AfterViewInit, Component, OnInit, Renderer2} from '@angular/core';
import {TodoClient, TodoVm, UserClient, UserVmRole} from '../app.api';
import {StatusChangeComponent} from '../components/status-change/status-change.component';
import {PopoverController} from '@ionic/angular';

@Component({
  selector: 'app-list-assigned',
  templateUrl: './list-assigned.page.html',
  styleUrls: ['./list-assigned.page.scss'],
})
export class ListAssignedPage implements OnInit, AfterViewInit {

  todos: TodoVm[] = [];
  editorUser: boolean;

  constructor(private todoClient: TodoClient,
              public popoverController: PopoverController,
              private renderer: Renderer2,
              private userClient: UserClient) { }

  ngOnInit() {
    this.getTodos();
  }

  ngAfterViewInit() {
    this.editorUser = this.userClient.getSessionUser() && this.userClient.getSessionUser().role !== UserVmRole.User;
  }

  doRefresh(event) {
    setTimeout(() => {
      console.log('Async operation has ended');
      this.getTodos();
      event.target.complete();
    }, 2000);
  }

  private getTodos() {
    this.todoClient.getAssigned()
        .subscribe((todos: TodoVm[]) => {
          this.todos = todos;
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

}
