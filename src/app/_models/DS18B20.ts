// DS18B20 Temperature - DS18x20 (4) in group 2
// https://github.com/arendst/Sonoff-Tasmota/wiki/Sensor-Configuration

export interface DS18B20 {
    Temperature: number;
    TempUnit: string;
}

export class DS18B20 {
    public Temperature: number;
    public TempUnit: string;

    constructor() {
        this.Temperature = 0;
        this.TempUnit = 'C';
    }


}
