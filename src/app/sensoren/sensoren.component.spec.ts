import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SensorenComponent } from './sensoren.component';

describe('SensorenComponent', () => {
  let component: SensorenComponent;
  let fixture: ComponentFixture<SensorenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SensorenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SensorenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
