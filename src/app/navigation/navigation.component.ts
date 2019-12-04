import {Component, OnInit} from '@angular/core';
import {faLightbulb, faClock, faTemperatureFrigid} from '@fortawesome/pro-solid-svg-icons';
import {ConfigService} from '../_services/config.service';
import {Subscription} from 'rxjs';


@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

    // Icons
    public lichter = faLightbulb;
    public timer = faClock;
    public sensoren = faTemperatureFrigid;
    public activePage: string;
    public subscription: Subscription;

    constructor(private config: ConfigService) {

        this.getActivePage();

    }

    ngOnInit() {
        this.getActivePage();
    }

    getActivePage() {
        this.subscription = this.config._activePage.subscribe(pageId => {
            this.activePage = pageId;
        });
    }

}
