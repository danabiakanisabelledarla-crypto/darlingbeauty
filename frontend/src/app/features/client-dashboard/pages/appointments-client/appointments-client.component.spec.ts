import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsClientComponent } from './appointments-client.component';

describe('AppointmentsClientComponent', () => {
  let component: AppointmentsClientComponent;
  let fixture: ComponentFixture<AppointmentsClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentsClientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppointmentsClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
