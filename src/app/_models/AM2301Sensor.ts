export interface AM2301Sensor {
    Temperature: number;
    Humidity: number;
    TempUnit: string;
}

export class AM2301Sensor {
    public Temperature: number;
    public Humidity: number;
    public TempUnit: string;

    constructor() {
        this.Temperature = 0;
        this.Humidity = 0;
        this.TempUnit = 'C';
    }


}
