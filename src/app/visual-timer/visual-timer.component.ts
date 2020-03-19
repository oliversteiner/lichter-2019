import { Component, OnInit } from '@angular/core'
import { getSunrise, getSunset } from 'sunrise-sunset-js'
import { SonoffTimer } from '../_models/sonoffTimer'
// import { faCheck, faTimes, faSpinner, faTrash} from '@fortawesome/pro-light-svg-icons';
import { faCheck, faTimes, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons'
import { IMqttMessage, MqttService } from 'ngx-mqtt'
import { ConfigService } from '../_services/config.service'
import { Device } from '../_models/devices'
import { DEVICES } from '../../assets/data/devices'
import { MqttResponse } from '../_models/mqttResponse'
import { Subscription } from 'rxjs'

interface DaySegment {
  id: number
  time: number
  active: boolean
  mood: 'night' | 'sunset-1' | 'sunset-2' | 'day' | 'sunrise-1' | 'sunrise-2'
}

interface Timer {
  time: string
  action: 'on' | 'off' | 'unchanged'
}

@Component({
  selector: 'app-visual-timer',
  templateUrl: './visual-timer.component.html',
  styleUrls: ['./visual-timer.component.scss'],
})
export class VisualTimerComponent implements OnInit {
  // Settings
  private debug: boolean
  private edit = false
  private loading: boolean
  private id = 'visual'

  // Devices from Data
  devices: Device[] = DEVICES

  // Icons
  private iconSave = faCheck
  private iconCancel = faTimes
  private iconClear = faTrash
  private iconSpinner = faSpinner

  // Times
  private sunset: Date
  private sunrise: Date
  private sunsetTime = '00:00'
  private sunriseTime = '00:00'
  private currentTime = '00:00'

  // Colors for Segments
  private colorDay = '#F0B046'
  private colorNight = '#005FC7'
  private colorSunrise1 = '#6F929C'
  private colorSunrise2 = '#B2AF8D'
  private colorSunset1 = '#B2AF8D'
  private colorSunset2 = '#6F929C'

  // Colors for Indicators
  private circleColorActive = 'white'
  private circleColorHover = 'white'
  private circleColorInactive = '#202020'

  // Opacity for Indicators
  private circleOpacityActive = '1'
  private circleOpacityHover = '0.5'
  private circleOpacityInactive = '0.2'

  // Arrays
  private daySegments: DaySegment[] = []
  private sonoffTimers: SonoffTimer[]
  private subscription_result: Subscription
  private result: string
  private globalTimerArm: number

  constructor(private _mqttService: MqttService, private _config: ConfigService) {
    // Debug
    this.debug = this._config.debug

    // Loading
    this.loading = true

    // Navigation
    this._config.setActivePage(this.id)

    // Time

    setInterval(() => {
      const date = new Date()
      this.currentTime = this.getTimeStringFromDate(date)
    }, 1000)

    for (const device of this.devices) {
      // get Timer1

      // Result Response
      this.subscription_result = this._mqttService
        .observe('stat/' + device.id + '/RESULT')
        .subscribe((message: IMqttMessage) => {
          this.result = message.payload.toString()
          console.log('result', JSON.parse(this.result))

          const mqttResponse: MqttResponse = JSON.parse(this.result)

          // Global Timer Arm
          if (mqttResponse.Timers && mqttResponse.Timers === 'ON') {
            this.globalTimerArm = 1
          }

          if (mqttResponse.Timers && mqttResponse.Timers === 'OFF') {
            this.globalTimerArm = 0
          }

          // Load all 16 Timers
          for (let i = 0; i <= 16; i++) {
            const timerNumber = i + 1
            const timerName = 'Timer' + timerNumber

            if (mqttResponse.Timers1 && mqttResponse.Timers1[timerName]) {
              this.sonoffTimers[i] = mqttResponse.Timers1[timerName]
              this.loading = false
            }
          }
        })
    }
  }

  click(nr: number) {
    this.edit = true
    this.toggleActivity(nr)
  }

  over(nr: number) {
    if (!this.daySegments[nr].active) {
      const elements = document.querySelectorAll('.oval-' + nr)

      elements.forEach((element: SVGElement) => {
        element.style.fill = this.circleColorHover
        element.style.fillOpacity = this.circleOpacityHover
      })
    }
  }

  out(nr: number) {
    if (!this.daySegments[nr].active) {
      const elements = document.querySelectorAll('.oval-' + nr)

      elements.forEach((element: SVGElement) => {
        element.style.fill = this.circleColorInactive
        element.style.fillOpacity = this.circleOpacityInactive
      })
    }
  }

  setActive(nr: number) {
    // State
    this.daySegments[nr].active = true

    // Visual
    const elements = document.querySelectorAll('.oval-' + nr)
    elements.forEach((element: SVGElement) => {
      element.style.fill = this.circleColorActive
      element.style.fillOpacity = this.circleOpacityActive
    })
  }

  setInactive(nr: number) {
    // State
    this.daySegments[nr].active = false

    // Visual
    const elements = document.querySelectorAll('.oval-' + nr)
    elements.forEach((element: SVGElement) => {
      element.style.fill = this.circleColorInactive
      element.style.fillOpacity = this.circleOpacityInactive
    })
  }

  toggleActivity(nr) {
    if (this.daySegments[nr].active) {
      this.setInactive(nr)
    } else {
      this.setActive(nr)
    }
  }

  setSegmentColor(nr: number, mode) {
    let color: string
    switch (mode) {
      case 'day':
        color = this.colorDay
        break
      case 'night':
        color = this.colorNight
        break
      case 'sunset-1':
        color = this.colorSunset1
        break
      case 'sunset-2':
        color = this.colorSunset2
        break
      case 'sunrise-1':
        color = this.colorSunrise1
        break
      case 'sunrise-2':
        color = this.colorSunrise2
        break
      default:
        color = 'red'
    }

    const elements = document.querySelectorAll('.hour-' + nr)
    elements.forEach((element: SVGAElement) => {
      element.style.fill = color
    })
  }

  setAllSegmentColors() {
    const sunriseHour = this.sunrise.getHours()
    const sunsetHour = this.sunset.getHours()

    // calculate lighting mood
    this.daySegments.map((segment: DaySegment) => {
      let mood: 'night' | 'sunset-1' | 'sunset-2' | 'day' | 'sunrise-1' | 'sunrise-2'
      if (segment.time < sunriseHour) {
        mood = 'night'
      } else if (segment.time == sunriseHour) {
        mood = 'sunrise-1'
      } else if (segment.time == sunriseHour + 1) {
        mood = 'sunrise-2'
      } else if (segment.time > sunriseHour + 1 && segment.time < sunsetHour - 1) {
        mood = 'day'
      } else if (segment.time == sunsetHour - 1) {
        mood = 'sunset-1'
      } else if (segment.time == sunsetHour) {
        mood = 'sunset-2'
      } else if (segment.time > sunsetHour) {
        mood = 'night'
      } else {
        //
      }
      segment.mood = mood
    })

    // set colors for all segments
    this.daySegments.map((segment: DaySegment) => {
      this.setSegmentColor(segment.id, segment.mood)
    })
  }

  /**
   * setTimeMark()
   *
   * Draws a line in DaySegment-SVG with actual time
   *
   * Position calculation:
   *    Day Segment Width is 40
   *    24h * 40  = 960 ticks
   *    minutes per day: 1440
   *    SVG Tick per Minutes: 960 / 1440 = 0.666
   *
   *    after some manual adjustments, best Ticks Factor is: 0.654
   *
   *    Example: 14.30 => 14h * 60m + 30m =  870m * 0.654 = 568.98
   *
   */
  setTimeMark() {
    const d = new Date()
    const hours = d.getHours()
    const minutes = d.getMinutes()

    const ticks = (hours * 60 + minutes) * 0.654 // ticks factor
    const clock = ((hours % 24) + minutes / 60) * 15

    const groupNowDesktop = document.getElementById('group-now-desktop')
    groupNowDesktop.setAttribute('transform', 'translate(' + ticks + ' 0)')

    // Circle line
    const nowCircle = document.getElementById('group-now-mobile')
    nowCircle.setAttribute('transform', 'rotate(' + clock + ' ,210, 210)')

    // Add text "hh:mm" on top half or bottom half
    const timeTextCircle = document.getElementById('label-time-now-circle')

    if (clock > 100 && clock < 270) {
      // place text on bottom
      timeTextCircle.setAttribute('transform', 'translate(0 40)')
    } else {
      // place text on top
      timeTextCircle.setAttribute('transform', 'translate(0 -2)')
    }
  }

  getMinutesLeadingZero(date) {
    return this.getLeadingZero(date.getMinutes())
  }

  getHoursLeadingZero(date) {
    return this.getLeadingZero(date.getHours())
  }

  getLeadingZero(nr: number) {
    return (nr < 10 ? '0' : '') + nr
  }

  getTimeStringFromDate(date) {
    const h = this.getHoursLeadingZero(date)
    const min = this.getMinutesLeadingZero(date)
    return h + ':' + min
  }

  /**
   * buildSegments()
   *
   * Generates an array of 24 segment-obj
   * Each segment represents 1 hour of the day
   * with:
   *  - id: number
   *  - time: number (n)
   *  - mood: 'night' | 'sunset-1' | 'sunset-2' | 'day' | 'sunrise-1' | 'sunrise-2'
   *  - active: boolean (if active: light on)
   */
  buildSegments() {
    const daySegments: DaySegment[] = []

    for (let i = 0; i < 24; i++) {
      const segment: DaySegment = {
        id: i,
        time: i,
        mood: 'night',
        active: false,
      }
      daySegments.push(segment)
    }
    this.daySegments = daySegments
  }

  /**
   * updateSegments()
   *
   * matches the individual segments of the SVG
   * with the information from this.daySegments
   *
   *
   */
  updateSegments() {
    let actionActive = 0
    this.daySegments.map(segment => {
      const stringTime = this.getTimeString(segment.id, 0)
      let arm = 0
      let action = 0
      const timer = this.sonoffTimers.find(timer => timer.Time === stringTime)
      if (timer) {
        arm = timer.Arm
        action = timer.Action
      }

      if (arm == 1) {
        if (action) {
          this.daySegments[segment.id].active = true
          this.setActive(segment.id)
          actionActive = 1
        } else {
          this.daySegments[segment.id].active = false
          this.setInactive(segment.id)
          actionActive = 0
        }
      } else {
        if (actionActive) {
          this.daySegments[segment.id].active = true
          this.setActive(segment.id)
          actionActive = 1
        }
      }
    })
  }

  /**
   * getDefaultTimers()
   *
   * returns an array of 16 SonoffTimer elements
   * with their default settings
   *
   * @return sonoffTimer[]
   */
  getDefaultTimers() {
    const sonoffTimers: SonoffTimer[] = []

    for (let i = 0; i < 16; i++) {
      const sonoffTimer: SonoffTimer = {
        Arm: 0,
        Mode: 0,
        Time: '00:00',
        Window: 0,
        Days: '0000000',
        Repeat: 0,
        Output: 0,
        Action: 0,
      }
      sonoffTimers.push(sonoffTimer)
    }
    return sonoffTimers
  }

  /**
   * resetSonoffTimers()
   *
   * replaces current sonoffTimers with
   * new Array of SonoffTimers with default Settings
   *
   */
  resetSonoffTimers() {
    this.sonoffTimers = this.getDefaultTimers()
  }

  /**
   * getSonoffTimers()
   *
   * returns SonoffTimer-Array
   *
   * first:
   *    load sonoff Timers from Local Storage
   *    if Local Storage is empty, return default Timers
   *
   * second:
   *    if mqtt service is available, it gets the timers from mqtt
   *
   * @return sonoffTimer[]
   */
  getSonoffTimers(): SonoffTimer[] {
    if (localStorage.getItem('sonoffTimers')) {
      const data: SonoffTimer[] = JSON.parse(localStorage.getItem('sonoffTimers'))
      if (data.length != 0) {
        return data
      } else return this.getDefaultTimers()
    } else return this.getDefaultTimers()
  }

  /**
   * setTimers()
   *
   * converts the active segments into a sonoffTimer array
   *
   */
  setTimers() {
    let previousActive = false
    let action: 'on' | 'off' | 'unchanged'
    let timers: Timer[] = []

    // passes through all segments and creates a serial sequence of action commands
    this.daySegments.map(segment => {
      // only first segment
      if (segment.id == 0) {
        if (segment.active) {
          previousActive = true
          action = 'on'
        } else {
          action = 'off'
        }
      }

      // inactive > active
      else if (previousActive == false && segment.active) {
        previousActive = true
        action = 'on'
      }
      // active > active
      else if (previousActive == true && segment.active) {
        previousActive = true
        action = 'unchanged'
      }
      // active > inactive
      else if (previousActive == true && !segment.active) {
        previousActive = false
        action = 'off'
      }
      // inactive > inactive
      else if (previousActive == false && !segment.active) {
        previousActive = false
        action = 'unchanged'
      } else {
      }

      const timer: Timer = {
        time: this.getLeadingZero(segment.time) + ':00',
        action: action,
      }
      // Add current Action to Timers
      timers.push(timer)
    })

    // reduces the 24 items from timers to those containing only changing actions
    this.resetSonoffTimers()
    let i = 0
    timers.map(timer => {
      if (timer.action == 'on') {
        const time = timer.time
        this.sonoffTimers[i] = {
          Arm: 1,
          Mode: 0,
          Time: timer.time,
          Window: 0,
          Days: '1111111',
          Repeat: 1,
          Output: 1,
          Action: 1,
        }
        i++
      }
      if (timer.action == 'off') {
        const time = timer.time
        this.sonoffTimers[i] = {
          Arm: 1,
          Mode: 0,
          Time: timer.time,
          Window: 0,
          Days: '1111111',
          Repeat: 1,
          Output: 1,
          Action: 0,
        }
        i++
      }
    })
  }

  /**
   * cancel()
   *
   * cancels the current processing and resets everything to the previous settings
   */
  cancel() {
    this.edit = false
    this.getSonoffTimers()
  }

  /**
   * clear()
   *
   * deletes current timer settings
   */
  clear() {
    this.edit = false
    localStorage.removeItem('sonoffTimers')
    this.resetSonoffTimers()
    this.buildSegments()
    this.updateSegments()
  }

  /**
   * save()
   *
   * saves current timer settings to local storage
   * and send it to mqtt-server
   */
  save() {
    this.edit = false

    this.setTimers()
    localStorage.setItem('sonoffTimers', JSON.stringify(this.sonoffTimers))

    this.publishSonoffTimers()
  }

  publishSonoffTimers() {
    this.sonoffTimers.map((timer: SonoffTimer, index) => {
      this.publishSonoffTimer(index + 1, timer)
    })
  }

  publishSonoffTimer(timerNumber: number, data: SonoffTimer): void {
    const topic = 'cmnd/sonoffs/Timer' + timerNumber
    const message = JSON.stringify(data)
    this._mqttService.unsafePublish(topic, message, { qos: 1, retain: true })
  }

  /**
   * getTimeString(hours, minutes)
   *
   * returns "hh:mm"
   *
   * @param hours
   * @param minutes
   */
  getTimeString(hours, minutes) {
    return this.getLeadingZero(hours) + ':' + this.getLeadingZero(minutes)
  }

  ngOnInit(): void {
    this.sonoffTimers = this.getSonoffTimers()
    this.buildSegments()
    navigator.geolocation.getCurrentPosition(position => {
      this.sunset = getSunset(position.coords.latitude, position.coords.longitude)
      this.sunrise = getSunrise(position.coords.latitude, position.coords.longitude)

      this.sunsetTime = this.getTimeStringFromDate(this.sunset)
      this.sunriseTime = this.getTimeStringFromDate(this.sunrise)

      this.setAllSegmentColors()
      this.setTimeMark()
      this.updateSegments()
    })
  }
}
