import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {SandboxComponent} from './sandbox/sandbox.component';
import {MqttSandboxComponent} from './mqtt-sandbox/mqtt-sandbox.component';
import {LichterComponent} from './lichter/lichter.component';
import {TimerComponent} from './timer/timer.component';
import {SensorenComponent} from './sensoren/sensoren.component';

const routes: Routes = [
    {path: 'sandbox', component: SandboxComponent},
    {path: 'mqtt-sandbox', component: MqttSandboxComponent},
    {path: 'lichter', component: LichterComponent},
    {path: 'timer', component: TimerComponent},
    {path: 'sensoren', component: SensorenComponent},

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
