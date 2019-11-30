import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TodoCreationPage } from './todo-creation.page';

describe('TodoCreationPage', () => {
  let component: TodoCreationPage;
  let fixture: ComponentFixture<TodoCreationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TodoCreationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoCreationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
