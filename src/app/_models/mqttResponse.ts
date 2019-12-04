import {AM2301Sensor} from './AM2301Sensor';
import {SonoffTimer} from './sonoffTimer';
import {DS18B20} from './DS18B20';


export interface MqttResponse {


    // Sonsores
    AM2301: AM2301Sensor;
    DS18B20: DS18B20;

    // Timers general
    Timers: string;
    Time: string;

    // Timers direct
    Timer1: SonoffTimer;
    Timer2: SonoffTimer;
    Timer3: SonoffTimer;
    Timer4: SonoffTimer;
    Timer5: SonoffTimer;
    Timer6: SonoffTimer;
    Timer7: SonoffTimer;
    Timer8: SonoffTimer;
    Timer9: SonoffTimer;
    Timer10: SonoffTimer;
    Timer11: SonoffTimer;
    Timer12: SonoffTimer;
    Timer13: SonoffTimer;
    Timer14: SonoffTimer;
    Timer15: SonoffTimer;
    Timer16: SonoffTimer;

    // Timers in Groups
    Timers1: {
        Timer1: SonoffTimer;
        Timer2: SonoffTimer;
        Timer3: SonoffTimer;
        Timer4: SonoffTimer;
    };
    Timers2: {
        Timer5: SonoffTimer;
        Timer6: SonoffTimer;
        Timer7: SonoffTimer;
        Timer8: SonoffTimer;
    };
    Timers3: {
        Timer9: SonoffTimer;
        Timer10: SonoffTimer;
        Timer11: SonoffTimer;
        Timer12: SonoffTimer;
    };
    Timers4: {
        Timer13: SonoffTimer;
        Timer14: SonoffTimer;
        Timer15: SonoffTimer;
        Timer16: SonoffTimer;
    };
}
