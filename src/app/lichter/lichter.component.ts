import {Component, OnInit} from '@angular/core';
import {Device} from '../_models/devices';
import {DEVICES} from '../../assets/data/devices';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {IMqttMessage, MqttService} from 'ngx-mqtt';
import {MqttResponse} from '../_models/mqttResponse';
import {ConfigService} from '../_services/config.service';
import {SonoffTimer} from '../_models/sonoffTimer';
import {faTemperatureFrigid, faClock} from '@fortawesome/pro-light-svg-icons';

@Component({
    selector: 'app-lichter',
    templateUrl: './lichter.component.html',
    styleUrls: ['./lichter.component.scss'],
    animations: [
        trigger('openClose', [
            // ...
            state('open', style({
                display: 'block',
                height: '80px',
                opacity: 1,
            })),
            state('closed', style({
                display: 'block',
                height: '0px',
                opacity: 0,
            })),
            transition('open => closed', [
                animate('0.2s')
            ]),
            transition('closed => open', [
                animate('0.2s')
            ]),
        ]),
    ],
})

export class LichterComponent implements OnInit {

    // General
    public title = 'Lichter';
    public id = 'lichter';
    public debug = true;
    public powerStatusAllDevices = false;

    // Devices from Data
    public devices: Device[] = DEVICES;

    // icons
    public sensorIcon = faTemperatureFrigid;
    public timerIcon = faClock;

// MQTT
    public power: string;
    public sensor: string;
    public sonoffTimers: SonoffTimer[];

    constructor(private _mqttService: MqttService, private _config: ConfigService) {

        // Debug
        this.debug = this._config.debug;

        // Navigation
        this._config.setActivePage(this.id);

        // Timer
        this.sonoffTimers = [];
        this.sonoffTimers[0] = new SonoffTimer();
        this.sonoffTimers[1] = new SonoffTimer();
        this.sonoffTimers[2] = new SonoffTimer();
        this.sonoffTimers[3] = new SonoffTimer();

        // set Status of sensorDetails to 'closed'
        for (const device of this.devices) {
            device.sensorDetails = false;
            device.timerIcon = 'Timer';
            device.powerIcon = 'Power';
            device.sensorIcon = 'Sensor';

            // Subscriptions
            // -----------------------------------------------------

            // Subscription Power
            device.subscriptionPower = this._mqttService.observe('stat/' + device.id + '/POWER')
                .subscribe((message: IMqttMessage) => {

                    // Debug
                    // console.log(device.id + ' Power:', message.payload.toString());

                    // Device Online?
                    device.online = true;

                    // Powerstatus
                    const status = message.payload.toString();

                    // Check
                    switch (status) {
                        case 'ON':
                            device.power = true;
                            break;

                        case 'OFF':
                            device.power = false;
                            break;

                        default:
                            device.power = false;
                            break;
                    }

                });

            // Subscription Sensor
            if (device.sensor) {
                device.subscriptionSensor = this._mqttService.observe('tele/' + device.id + '/SENSOR')
                    .subscribe((message: IMqttMessage) => {

                        // console.log(device.id + ' Sensor:', message.payload.toString());
                        const mqttResponse: MqttResponse = JSON.parse(message.payload.toString());

                        // witch Sensor?
                        // Sensor is AM2301
                        if (mqttResponse.AM2301) {

                            // Set temperature
                            device.temperature = mqttResponse.AM2301.Temperature;

                            // Set humidity
                            device.humidity = mqttResponse.AM2301.Humidity;
                        }

                        // Sensor is DS18B20
                        if (mqttResponse.DS18B20) {

                            // Set temperature
                            device.temperature = mqttResponse.DS18B20.Temperature;
                        }


                    });


            }

            // Subscription Result
            device.subscriptionResult = this._mqttService.observe('stat/' + device.id + '/RESULT')
                .subscribe((message: IMqttMessage) => {

                  //  console.log(device.id + ' Result:', JSON.parse(message.payload.toString()));

                    const mqttResponse: MqttResponse = JSON.parse(message.payload.toString());

                    // Global Timer Arm
                    if (mqttResponse.Timers && mqttResponse.Timers === 'ON') {
                        device.timer = true;
                    }

                    // Global Timer Arm
                    if (mqttResponse.Timers && mqttResponse.Timers === 'OFF') {
                        device.timer = false;
                    }

                    // Load first 4 Timers
                    // (Day On, Day Off, Night On, Night off)
                    for (let i = 0; i <= 3; i++) {

                        const timerNumber = i + 1;
                        const timerName = 'Timer' + timerNumber;

                        if (mqttResponse.Timers1 && mqttResponse.Timers1[timerName]) {
                            this.sonoffTimers[i] = mqttResponse.Timers1[timerName];
                        }
                    }

                });


            this.getPowerStatus(device);
            this.getTimerStatus(device);
            this.getSensorData(device);

        }
    }

    ngOnInit() {

        // Navigation
        this._config.setActivePage(this.id);

    }

    toggleTimer(device: Device): void {
        let message = '0';
        const topic = 'cmnd/' + device.id + '/Timers';

        if (device.timer) {
            device.timer = false;
            message = '0';

        } else {
            device.timer = true;
            message = '1';

        }

        this._mqttService.unsafePublish(topic, message, {qos: 1, retain: true});
        this.getTimerStatus(Device);

    }

    togglePower(device: Device): void {


        if (device.power === true) {
            device.power = false;
            this.powerOff(device);

        } else {
            this.powerOn(device);

            device.power = true;
        }
    }

    togglePowerAll() {

        if (this.powerStatusAllDevices === false) {
            this.powerStatusAllDevices = true;

            for (const device of this.devices) {
                this.powerOn(device);

            }

        } else {
            this.powerStatusAllDevices = false;

            for (const device of this.devices) {
                this.powerOff(device);

            }
        }

    }

    toggleDetails(device: Device) {
        device.sensorDetails = device.sensorDetails !== true;
        this.getSensorData(device);
    }


    powerOn(device): void {
        const topic = 'cmnd/' + device.id + '/power';
        const message = 'ON';

        // get data
        this._mqttService.unsafePublish(topic, message, {qos: 1, retain: true});

    }

    powerOff(device): void {
        const topic = 'cmnd/' + device.id + '/power';
        const message = 'OFF';
        this._mqttService.unsafePublish(topic, message, {qos: 1, retain: true});

    }

    getPowerStatus(device): void {
        const topic = 'cmnd/' + device.id + '/power';
        const message = '';
        this._mqttService.unsafePublish(topic, message, {qos: 1, retain: true});

    }


    getTimerStatus(device?): void {

      //  console.log('getTimerStatus', device);

        if (device === undefined || device === false) {
            device = this.getFirstOnlineDevice();
        }

        const topic = 'cmnd/' + device.id + '/Timers';

        const message = '';
        this._mqttService.unsafePublish(topic, message, {qos: 1, retain: true});

    }

    getSensorData(device): void {
        const topic = 'cmnd/' + device.id + '/TelePeriod';
        let message = '10';
        this._mqttService.unsafePublish(topic, message, {qos: 1, retain: true});

        setTimeout(() => {
                message = '60';
                this._mqttService.unsafePublish(topic, message, {qos: 1, retain: true});
            },
            1000
        );
    }

    hideContent(event) {

        if (event.toState === 'closed') {
            event.element.children[0].style.display = 'none';
        }
    }

    showContent(event) {

        if (event.toState === 'open') {
            event.element.children[0].style.display = 'flex';

        }
    }

    getFirstOnlineDevice() {

        const devices = this.devices.filter(device => {
            if (device.online === true) {
                return device;
            }
        });

        return devices[0];

    }
}


