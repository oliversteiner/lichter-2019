import {Device} from '../../app/_models/devices';


export const DEVICES: Device[] =
    [



        {
            name: 'Pergola',
            place: 'Pergola Mitte',
            timer: false,
            power: false,
            online: false,
            sensor: true,
            temperature: 0,
            humidity: 0,
            group: 'sonoffs',
            id: 'sonoff-pergola',
            ip: '10.0.2.16',

        },


        {
            name: 'Stern  Pergola',
            place: 'Pergola hinten',
            timer: false,
            power: false,
            online: false,
            sensor: true,
            temperature: 0,
            humidity: 0,
            group: 'sonoffs',
            id: 'sonoff-stern-pergola',
            ip: '10.0.2.15',

        },

        {
            name: 'Stern und Laube',
            place: 'Aussentemperatur Eingang',
            timer: true,
            power: false,
            online: false,
            sensor: true,
            temperature: 0,
            humidity: 0,
            group: 'sonoffs',
            id: 'sonoff-stern-laube',
            ip: '10.0.2.14',
        },

        {
            name: 'Erker - Terrasse',
            timer: false,
            power: false,
            online: false,
            sensor: false,
            group: 'sonoffs',
            id: 'sonoff-erker-terrasse',
            ip: '10.0.2.13',

        },

        {
            name: 'Sitzplatz',
            place: 'Christbaum beim Sitzplatz',
            timer: false,
            power: false,
            online: false,
            sensor: false,
            group: 'sonoffs',
            id: 'sonoff-sitzplatz',
            ip: '10.0.2.12',

        },
    ];
