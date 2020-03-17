import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualTimerComponent } from './visual-timer.component';

describe('VisualTimerComponent', () => {
  let component: VisualTimerComponent;
  let fixture: ComponentFixture<VisualTimerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualTimerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
