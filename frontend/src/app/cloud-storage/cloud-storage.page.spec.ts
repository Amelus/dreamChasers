import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CloudStoragePage } from './cloud-storage.page';

describe('CloudStoragePage', () => {
  let component: CloudStoragePage;
  let fixture: ComponentFixture<CloudStoragePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloudStoragePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloudStoragePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
