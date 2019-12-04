import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {IMqttMessage, MqttService} from 'ngx-mqtt';
import {MqttResponse} from '../_models/mqttResponse';

@Component({
    selector: 'app-mqtt-sandbox',
    templateUrl: './mqtt-sandbox.component.html',
    styleUrls: ['./mqtt-sandbox.component.scss']
})


export class MqttSandboxComponent implements OnInit, OnDestroy {
    private subscription_world: Subscription;
    private subscription_power: Subscription;
    private subscription_sensor: Subscription;
    private subscription_status: Subscription;
    private subscription_test: Subscription;
    private subscription_result: Subscription;
    private subscription_timer: Subscription;
    public message: string;
    public power: string;
    public timerStatus: string;
    public sensor: string;
    public status: string;
    public testresult: string;
    public test_topic: string;
    private test_message: any;
    public result: any;


    constructor(private _mqttService: MqttService) {

        this.test_topic = '';


        // World
        this.subscription_world = this._mqttService.observe('/World').subscribe((message: IMqttMessage) => {
            // console.log('message', message.payload);
            this.message = message.payload.toString();

        });

        // Power
        this.subscription_power = this._mqttService.observe('stat/sonoff/POWER').subscribe((message: IMqttMessage) => {
            // console.log('power', message.payload);
            this.power = message.payload.toString();

        });

        // Timer
        this.subscription_timer = this._mqttService.observe('tele/sonoff/Timers').subscribe((message: IMqttMessage) => {
            // console.log('timer1', message.payload);
            this.timerStatus = message.payload.toString();

        });

        // Sensor
        this.subscription_sensor = this._mqttService.observe('tele/sonoff/SENSOR').subscribe((message: IMqttMessage) => {
            // console.log('sensor', message.payload);

            this.sensor = message.payload.toString();
            // console.log('sensor', this.sensor);


        });

        // Status
        this.subscription_status = this._mqttService.observe('tele/sonoff/STATE').subscribe((message: IMqttMessage) => {
            // console.log('status', message.payload);

            this.status = message.payload.toString();
            // console.log('status', this.status);


        });


        // Result Response
        this.subscription_result = this._mqttService.observe('stat/sonoff/RESULT').subscribe((message: IMqttMessage) => {
            // console.log('result', message.payload);

            this.result = message.payload.toString();
            // console.log('result', this.result);

            const mqttResponse: MqttResponse = JSON.parse(message.payload.toString());

            // Set updated data to Device

            // Timer
            if (mqttResponse.Timer1) {
                const timerStatus = mqttResponse.Timer1.Arm;

                // Check
                switch (timerStatus) {
                    case 1:
                        this.timerStatus = 'ON';
                        break;
                    case 0:
                        this.timerStatus = 'OFF';
                        break;
                    default:
                        this.timerStatus = 'Unbekannt';
                        break;
                }
            }

        });


        // Test
        if (this.test_topic !== '') {
            this.subscription_test = this._mqttService.observe(this.test_topic).subscribe((message: IMqttMessage) => {
                // console.log('test', message.payload);

                this.testresult = message.payload.toString();
                // console.log('test', this.testresult);


            });
        }


    }


    public powerOn(): void {
        const topic = 'cmnd/sonoff/power';
        const message = 'ON';

        this._mqttService.unsafePublish(topic, message, {qos: 1, retain: true});

    }

    public powerOff(): void {
        const topic = 'cmnd/sonoff/power';
        const message = 'OFF';
        this._mqttService.unsafePublish(topic, message, {qos: 1, retain: true});

    }

    public getPowerStatus(): void {
        const topic = 'cmnd/sonoff/power';
        const message = '';
        this._mqttService.unsafePublish(topic, message, {qos: 1, retain: true});

    }

    public getTimerStatus(): void {
        const topic = 'cmnd/sonoff/Timer';
        const message = '1';
        this._mqttService.unsafePublish(topic, message, {qos: 1, retain: true});

    }

    public getStatus(): void {
        const topic = 'cmnd/sonoff/status';
        const message = '8';
        this._mqttService.unsafePublish(topic, message, {qos: 1, retain: true});

    }

    // Dont Use:
    // {"Command":"Error"}
    public getSensorStatus(): void {
        const topic = 'cmnd/sonoff/SENSOR';
        const message = '';
        this._mqttService.unsafePublish(topic, message, {qos: 1, retain: true});

    }

    public getSensorData(): void {

        //    this.getSensorStatus(); // dont use: response error

        const topic = 'cmnd/sonoff/TelePeriod';
        let message = '10';
        this._mqttService.unsafePublish(topic, message, {qos: 1, retain: true});

        // After 2 minutes reduce sensor activation back to 5 Minutes
        setTimeout(() => {
                message = '300'; // in Seconds
                this._mqttService.unsafePublish(topic, message, {qos: 1, retain: true});
            },
            2000 // in Miliseconds
        );
    }

    public setTimezone(): void {
        const topic = 'cmnd/sonoff/Timezone';
        const message = '1';
        this._mqttService.unsafePublish(topic, message, {qos: 1, retain: true});

    }

    /**
     * TEST
     *
     */
    public test(): void {
        const topic = this.test_topic;
        const message = this.test_message;
        this._mqttService.unsafePublish(topic, message, {qos: 1, retain: true});

    }


    public ngOnDestroy() {

        const topic = 'cmnd/sonoff/TelePeriod';
        const message = '1';
        this._mqttService.unsafePublish(topic, message, {qos: 1, retain: true});


        this.subscription_world.unsubscribe();
        this.subscription_power.unsubscribe();
        this.subscription_sensor.unsubscribe();
        this.subscription_status.unsubscribe();
      //  this.subscription_test.unsubscribe();
        this.subscription_result.unsubscribe();
        this.subscription_timer.unsubscribe();


    }

    public ngOnInit(): void {

    }
}
