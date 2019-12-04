import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    private activePage = '';
    public debug = false;
    public _activePage: Subject<any> = new Subject<any>();


    constructor() {
        this.setActivePage('timer');

    }


    setActivePage(pageId) {
        // console.log('setActivePage', pageId);

        this.activePage = pageId;
        this._activePage.next(pageId);
    }

    getActivePage() {
        return this.activePage;
    }

    toggleDebug() {
        this.debug = !this.debug;
    }
}
