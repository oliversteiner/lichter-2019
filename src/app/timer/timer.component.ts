import {Component, OnDestroy, OnInit} from '@angular/core';
import {SonoffTimer} from '../_models/sonoffTimer';
import {IMqttMessage, MqttService} from 'ngx-mqtt';
import {Subscription} from 'rxjs';
import {MqttResponse} from '../_models/mqttResponse';
import {Device} from '../_models/devices';
import {DEVICES} from '../../assets/data/devices';
import {ConfigService} from '../_services/config.service';
// Icons
import {faChevronUp, faChevronDown, faCheck, faTimes, faSpinner} from '@fortawesome/pro-light-svg-icons';


interface Timer {
  h: number;
  m: number;
}

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit, OnDestroy {

  // General
  title = 'Timer';
  id = 'timer';
  debug = false;
  edit = false;

  timerStatus: string;
  subscription_result: Subscription;
  result: string;
  sonoffTimers: SonoffTimer[];
  globalTimerArm: number;

  // icons
  iconStepUp = faChevronUp;
  iconStepDown = faChevronDown;
  iconSave = faCheck;
  iconCancel = faTimes;
  iconSpinner = faSpinner;

  // timer
  timers: Timer[];


  // Devices from Data
  devices: Device[] = DEVICES;
  loading: boolean;

  constructor(private _mqttService: MqttService, private _config: ConfigService) {

    // Debug
    this.debug = this._config.debug;

    // Loading
    this.loading = true;

    // Navigation
    this._config.setActivePage(this.id);

    // Devices
    this.sonoffTimers = [];
    this.sonoffTimers[0] = new SonoffTimer();
    this.sonoffTimers[1] = new SonoffTimer();
    this.sonoffTimers[2] = new SonoffTimer();
    this.sonoffTimers[3] = new SonoffTimer();

    this.globalTimerArm = 0;

    // Timer
    this.timers = [
      {
        h: 0,
        m: 0,
      },
      {
        h: 0,
        m: 0,
      },
      {
        h: 0,
        m: 0,
      },
      {
        h: 0,
        m: 0,
      }
    ];

    for (const device of this.devices) {

      // get Timer1

      // Result Response
      this.subscription_result = this._mqttService.observe('stat/' + device.id + '/RESULT')
        .subscribe((message: IMqttMessage) => {

          this.result = message.payload.toString();
          // console.log('result', JSON.parse(this.result));

          const mqttResponse: MqttResponse = JSON.parse(this.result);


          // Global Timer Arm
          if (mqttResponse.Timers && mqttResponse.Timers === 'ON') {
            this.globalTimerArm = 1;
          }

          if (mqttResponse.Timers && mqttResponse.Timers === 'OFF') {
            this.globalTimerArm = 0;
          }

          // Load first 4 Timers
          // (Day On, Day Off, Night On, Night off)
          for (let i = 0; i <= 3; i++) {

            const timerNumber = i + 1;
            const timerName = 'Timer' + timerNumber;

            if (mqttResponse.Timers1 && mqttResponse.Timers1[timerName]) {
              this.sonoffTimers[i] = mqttResponse.Timers1[timerName];
              this.loading = false;
            }

          }

          // Dont update if user currently edit the times
          if (this.edit === false) {

            //
            this.loadTimer();

            // Update GUI
            this.checkTimerStatus();

          }


        });
    }
    this.getTimerStatus();


  }

  ngOnInit() {

    // Navigation
    this._config.setActivePage(this.id);

    // Set NTP Server for correct Timers
    this.publishNtpServer();

  }

  checkTimerStatus() {

    this.timerStatus = 'Timer aus';

    // Check status
    if (this.globalTimerArm) {
      this.timerStatus = 'Timer an';
    }


  }


  toggleTimer() {

    this._config.setActivePage(this.id);

    let message = '0';
    const topic = 'cmnd/sonoffs/Timers';

    if (this.globalTimerArm === 1) {
      this.globalTimerArm = 0;
      message = '0';

    } else {
      this.globalTimerArm = 1;
      message = '1';

    }

    this._mqttService.unsafePublish(topic, message, {qos: 1, retain: true});
    this.getTimerStatus();
  }


  getTimerStatus(): void {
    const topic = 'cmnd/sonoffs/Timers';
    const message = '';
    this._mqttService.unsafePublish(topic, message, {qos: 1, retain: true});
  }


  loadTimer() {
    for (let i = 0; i <= 3; i++) {

      // Timer Day On
      const arrOn = this.sonoffTimers[i].Time.split(':');
      this.timers[i].h = Number(arrOn[0]);
      this.timers[i].m = Number(arrOn[1]);
    }
  }


  buildSonoffTimers() {

    // Day On
    // Set Default Sonoff Timer Values
    this.sonoffTimers[0].Arm = 1;
    this.sonoffTimers[0].Action = 1;
    this.sonoffTimers[0].Days = '1111111';
    this.sonoffTimers[0].Repeat = 1;
    this.sonoffTimers[0].Output = 1;

    // Day Off
    // Set Default Sonoff Timer Values
    this.sonoffTimers[1].Arm = 1;
    this.sonoffTimers[1].Action = 0;
    this.sonoffTimers[1].Days = '1111111';
    this.sonoffTimers[1].Repeat = 1;
    this.sonoffTimers[1].Output = 1;

    // Night On
    // Set Default Sonoff Timer Values
    this.sonoffTimers[2].Arm = 1;
    this.sonoffTimers[2].Action = 1;
    this.sonoffTimers[2].Days = '1111111';
    this.sonoffTimers[2].Repeat = 1;
    this.sonoffTimers[2].Output = 1;

    // Night Off
    // Set Default Sonoff Timer Values
    this.sonoffTimers[3].Arm = 1;
    this.sonoffTimers[3].Action = 0;
    this.sonoffTimers[3].Days = '1111111';
    this.sonoffTimers[3].Repeat = 1;
    this.sonoffTimers[3].Output = 1;

  }

  publishSonoffTimers() {
    for (let i = 0; i <= 3; i++) {

      this.publishSonoffTimer(i + 1, this.sonoffTimers[i]);
    }
  }


  publishSonoffTimer(timerNumber: number, data: SonoffTimer): void {
    const topic = 'cmnd/sonoffs/Timer' + timerNumber;
    const message = JSON.stringify(data);
    this._mqttService.unsafePublish(topic, message, {qos: 1, retain: true});

  }

  /**
   *
   *    NTP Servers Swiss
   *   0.ch.pool.ntp.org
   *   1.ch.pool.ntp.org
   *   2.ch.pool.ntp.org
   *   3.ch.pool.ntp.org
   */
  publishNtpServer(): void {
    const ntp_server_1 = '0.ch.pool.ntp.org';
    const ntp_server_2 = '1.ch.pool.ntp.org';
    const topic = 'cmnd/sonoffs/NtpServer';
    const topic_1 = topic + '1';
    const topic_2 = topic + '2';
    this._mqttService.unsafePublish(topic_1, ntp_server_1, {qos: 1, retain: true});
    this._mqttService.unsafePublish(topic_2, ntp_server_2, {qos: 1, retain: true});

  }

  ngOnDestroy() {
    this.subscription_result.unsubscribe();

  }

  stepUpHours(timer: number) {

    this.edit = true;

    let number = this.timers[timer].h;

    // Step up Hours 0...23
    if (number >= 23) {
      number = 0;
    } else {
      number++;
    }

    this.timers[timer].h = number;
  }

  stepUpMinutes(timer: number) {

    this.edit = true;

    let number = this.timers[timer].m;

    // Step up Minutes 0...59
    if (number >= 59) {
      number = 0;
    } else {
      number++;
    }

    this.timers[timer].m = number;
  }

  stepDownHours(timer: number) {

    this.edit = true;

    let number = this.timers[timer].h;

    // Step down Hours 0...23
    if (number <= 0) {
      number = 23;
    } else {
      number--;
    }

    this.timers[timer].h = number;
  }

  stepDownMinutes(timer: number) {

    this.edit = true;

    let number = this.timers[timer].m;

    // Step down Minutes 0...59
    if (number <= 0) {
      number = 59;
    } else {
      number--;
    }

    this.timers[timer].m = number;
  }

  cancel() {

    this.edit = false;

    this.getTimerStatus();

  }

  save() {

    this.edit = false;

    // Day   - Timer On   : 0
    // Day   - Timer Off  : 1
    // Night - Timer On   : 2
    // Night - Timer Off  : 3

    for (let i = 0; i <= 3; i++) {
      this.sonoffTimers[i].Time = this.timers[i].h + ':' + this.timers[i].m;
    }


    this.buildSonoffTimers();
    this.publishSonoffTimers();
  }

  reloadTimers() {
    this.getTimerStatus();
  }


}
