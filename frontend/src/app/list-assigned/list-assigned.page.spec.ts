import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAssignedPage } from './list-assigned.page';

describe('ListAssignedPage', () => {
  let component: ListAssignedPage;
  let fixture: ComponentFixture<ListAssignedPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAssignedPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAssignedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
