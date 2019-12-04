import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SandboxComponent} from './sandbox/sandbox.component';
import {MqttSandboxComponent} from './mqtt-sandbox/mqtt-sandbox.component';
import {FormsModule} from '@angular/forms';

import {
    MqttModule,
    IMqttServiceOptions
} from 'ngx-mqtt';
import {LichterComponent} from './lichter/lichter.component';
import {TimerComponent} from './timer/timer.component';
import {SensorenComponent} from './sensoren/sensoren.component';
import {FooterComponent} from './footer/footer.component';
import {HeaderComponent} from './header/header.component';
import {NavigationComponent} from './navigation/navigation.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {environment} from '../environments/environment';

export const MQTT_SERVICE_OPTIONS: IMqttServiceOptions = {


    // Import Credentials from Environment
     clientId: environment.clientId,
     connectTimeout: environment.connectTimeout,
     hostname: environment.hostname,
     port: environment.port,
     path: environment.path,
     username: environment.username,
     password: environment.password,
};

//
@NgModule({
    declarations: [
        AppComponent,
        SandboxComponent,
        MqttSandboxComponent,
        LichterComponent,
        TimerComponent,
        SensorenComponent,
        FooterComponent,
        HeaderComponent,
        NavigationComponent,

    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        FormsModule,
        MqttModule.forRoot(MQTT_SERVICE_OPTIONS),
        FontAwesomeModule,


    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    console.log('environment', environment.name); // Logs false for default environment
  //  console.log('MQTT_SERVICE_OPTIONS', MQTT_SERVICE_OPTIONS);
  }
}
