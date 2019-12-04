import {Component, OnInit} from '@angular/core';
import {appVersion} from '../app.version';
import {ConfigService} from '../_services/config.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

    appVersion = appVersion;
    public debug: boolean;

    constructor(private config: ConfigService) {
        this.debug = this.config.debug;
    }

    ngOnInit() {
    }

}
