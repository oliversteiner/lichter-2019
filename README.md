# Lichter 2019 v2.1.0

Simple webapp to control christmas lights.

Send MQTT Topics via Websockets to EMQX Broker to Sonoff Devices.

IoT Devices are Sonoff TH10 with Tasmota Firmware.

Angular 9 - IoT -  MQTT

https://github.com/arendst/Sonoff-Tasmota



## Install
- Install Angular 9
- Clone Project `git clone https://github.com/oliversteiner/lichter-2019.git`
- Change into project directory `cd lichter-2019`
- Install dependencies `npm i`

## Run 
Run `ng serve` for a dev server. 
Navigate to `http://localhost:4200/`. 
The app will automatically reload if you change any of the source files.

## Deploy
- Run `g build`
- Copy "dist/Lichter" to your Webserver


## TODO

[ ] Refactor MQTT-Commands as Service

[ ] Timer Settings as Timeline with Sunrise

[ ] Better Mobile Design
