import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MindMapPage } from './mind-map.page';

describe('MindMapPage', () => {
  let component: MindMapPage;
  let fixture: ComponentFixture<MindMapPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MindMapPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MindMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
