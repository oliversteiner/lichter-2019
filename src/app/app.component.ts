import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'Lichter 2018';
    debug = true;

    constructor(private router: Router) {

    }

    ngOnInit(): void {
         this.router.navigate(['/lichter']);
        // this.router.navigate(['/timer']);

    }
}
