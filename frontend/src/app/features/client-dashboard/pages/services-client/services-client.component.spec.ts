import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicesClientComponent } from './services-client.component';

describe('ServicesClientComponent', () => {
  let component: ServicesClientComponent;
  let fixture: ComponentFixture<ServicesClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesClientComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServicesClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
