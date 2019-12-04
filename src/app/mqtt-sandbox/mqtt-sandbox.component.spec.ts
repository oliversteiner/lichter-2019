import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MqttSandboxComponent } from './mqtt-sandbox.component';

describe('MqttSandboxComponent', () => {
  let component: MqttSandboxComponent;
  let fixture: ComponentFixture<MqttSandboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MqttSandboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MqttSandboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
