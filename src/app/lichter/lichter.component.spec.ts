import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LichterComponent } from './lichter.component';

describe('LichterComponent', () => {
  let component: LichterComponent;
  let fixture: ComponentFixture<LichterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LichterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LichterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
