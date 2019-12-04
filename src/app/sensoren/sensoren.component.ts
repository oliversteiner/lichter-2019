import {Component, OnInit} from '@angular/core';
import {Device} from '../_models/devices';
import {DEVICES} from '../../assets/data/devices';
import {IMqttMessage, MqttService} from 'ngx-mqtt';
import {MqttResponse} from '../_models/mqttResponse';
import {ConfigService} from '../_services/config.service';

@Component({
    selector: 'app-sensoren',
    templateUrl: './sensoren.component.html',
    styleUrls: ['./sensoren.component.scss']
})
export class SensorenComponent implements OnInit {

    // General
    title = 'Sensoren';
    id = 'sensoren';
    debug = false;

    // Get List of Devices from /assets/data/devices
    devices: Device[] = DEVICES;


    constructor(private _mqttService: MqttService, private _config: ConfigService) {

        // Debug Modus
        this.debug = this._config.debug;

        // Set navigation-tabs to "Sensoren"
        this._config.setActivePage(this.id);

        // Loop all Devices
        // -- Search for Sensors
        // ---- Update Sensor-Data
        for (const device of this.devices) {

            // Subscriptions
            // -----------------------------------------------------

            // Subscription Sensor
            if (device.sensor) {
                device.subscriptionSensor = this._mqttService.observe('tele/' + device.id + '/SENSOR')
                    .subscribe((message: IMqttMessage) => {

                        // Debug
                      //  console.log(device.id + ' Sensor:', message.payload.toString());

                        // Device Online?
                        device.online = true;

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

            // Force Device to send Data
            this.getSensorData(device);
        }
    }

    ngOnInit() {

        // Navigation
        this._config.setActivePage(this.id);
    }

    public getSensorData(device): void {
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


    getAllData() {
        for (const device of this.devices) {

            if (device.sensor) {
               // console.log('devices', device);

                this.getSensorData(device);
            }
        }
    }
}
