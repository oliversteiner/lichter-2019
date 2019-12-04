// https://github.com/arendst/Sonoff-Tasmota/wiki/Commands#timers

export interface SonoffTimer {
    Arm: number;    // 1 | 0
    Mode: number;   // 1 | 0
    Time: string;   // 	hh:mm
    Window: number; // 0 .. 15
    Days: string;   // "1111111" (SMTWTFS)
    Repeat: number;   // 1 | 0
    Output: number; // 1 .. 16
    Action: any;    // 0 | 1 | 2 | 3
}

export class SonoffTimer {
    public Arm: number;    // 1 | 0
    public Mode: number;   // 1 | 0
    public Time: string;   // 	hh:mm
    public Window: number; // 0 .. 15
    public Days: string;   // "1111111" (SMTWTFS)
    public Repeat: number;   // 1 | 0
    public Output: number; // 1 .. 16
    public Action: any;    // 0 | 1 | 2 | 3


    constructor() {
        this.Arm = 0;
        this.Mode = 0;
        this.Time = '00:00';
        this.Window = 0;
        this.Days = '0000000';
        this.Repeat = 0;
        this.Output = 0;
        this.Action = 0;
    }
}
