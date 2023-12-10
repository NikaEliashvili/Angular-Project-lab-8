import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaptopManagementComponent } from './laptop-management.component';

describe('LaptopManagementComponent', () => {
  let component: LaptopManagementComponent;
  let fixture: ComponentFixture<LaptopManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LaptopManagementComponent]
    });
    fixture = TestBed.createComponent(LaptopManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
