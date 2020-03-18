import { Injectable } from '@angular/core'
import { Subject } from 'rxjs'
import { environment } from '../../environments/environment'

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private activePage = ''
  public debug = false
  public _activePage: Subject<any> = new Subject<any>()

  constructor() {
    // only for develop: go to Selected Page
    if (environment.debug) {
      this.setActivePage('visual')
    }
  }

  setActivePage(pageId) {
    console.log('setActivePage', pageId)

    this.activePage = pageId
    this._activePage.next(pageId)
  }

  getActivePage() {
    return this.activePage
  }

  toggleDebug() {
    this.debug = !this.debug
  }
}
