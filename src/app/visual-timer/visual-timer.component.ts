import { Component, OnInit } from '@angular/core'
import { getSunrise, getSunset } from 'sunrise-sunset-js'
import { SonoffTimer } from '../_models/sonoffTimer'
// import { faCheck, faTimes, faSpinner, faTrash} from '@fortawesome/pro-light-svg-icons';
import { faCheck, faTimes, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons'

interface DaySegment {
  id: number
  time: number
  active: boolean
  mode: 'night' | 'sunset-1' | 'sunset-2' | 'day' | 'sunrise-1' | 'sunrise-2'
}

@Component({
  selector: 'app-visual-timer',
  templateUrl: './visual-timer.component.html',
  styleUrls: ['./visual-timer.component.scss'],
})
export class VisualTimerComponent implements OnInit {
  private sunset: Date
  private sunrise: Date

  // icons
  iconSave = faCheck
  iconCancel = faTimes
  iconClear = faTrash
  iconSpinner = faSpinner

  sunsetTime = '00:00'
  sunriseTime = '00:00'

  colorDay = '#F0B046'
  colorNight = '#005FC7'
  colorSunrise1 = '#6F929C'
  colorSunrise2 = '#B2AF8D'
  colorSunset1 = '#B2AF8D'
  colorSunset2 = '#6F929C'

  circleColorActive = 'white'
  circleColorHover = 'white'
  circleColorInactive = '#202020'

  circleOpacityActive = '1'
  circleOpacityHover = '0.5'
  circleOpacityInactive = '0.2'

  daySegments: DaySegment[] = []
  private sonoffTimers: SonoffTimer[]
  private edit = false

  click(nr: number) {
    this.edit = true
    this.toggleActivity(nr)
  }

  over(nr: number) {
    if (!this.daySegments[nr].active) {
      document.getElementById('oval-' + nr).style.fill = this.circleColorHover
      document.getElementById('oval-' + nr).style.fillOpacity = this.circleOpacityHover
    }
  }

  out(nr: number) {
    if (!this.daySegments[nr].active) {
      document.getElementById('oval-' + nr).style.fill = this.circleColorInactive
      document.getElementById('oval-' + nr).style.fillOpacity = this.circleOpacityInactive
    }
  }

  setActive(nr: number) {
    // State
    this.daySegments[nr].active = true

    // Visual
    document.getElementById('oval-' + nr).style.fill = this.circleColorActive
    document.getElementById('oval-' + nr).style.fillOpacity = this.circleOpacityActive
  }

  setInactive(nr: number) {
    // State
    this.daySegments[nr].active = false

    // Visual
    document.getElementById('oval-' + nr).style.fill = this.circleColorInactive
    document.getElementById('oval-' + nr).style.fillOpacity = this.circleOpacityInactive
  }

  toggleActivity(nr) {
    if (this.daySegments[nr].active) {
      this.setInactive(nr)
    } else {
      this.setActive(nr)
    }
  }

  setColor(nr: number, mode) {
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

    document.getElementById('hour-' + nr).style.fill = color
  }

  setColors() {
    const sunriseHour = this.sunrise.getHours()
    const sunsetHour = this.sunset.getHours()

    // set mode
    this.daySegments.map((segment: DaySegment) => {
      let mode: 'night' | 'sunset-1' | 'sunset-2' | 'day' | 'sunrise-1' | 'sunrise-2'
      if (segment.time < sunriseHour) {
        // night
        mode = 'night'
      } else if (segment.time == sunriseHour) {
        // sunrise 1
        mode = 'sunrise-1'
      } else if (segment.time == sunriseHour + 1) {
        // sunrise 2
        mode = 'sunrise-2'
      } else if (segment.time > sunriseHour + 1 && segment.time < sunsetHour - 1) {
        // day
        mode = 'day'
      } else if (segment.time == sunsetHour - 1) {
        // sunrise 1
        mode = 'sunset-1'
      } else if (segment.time == sunsetHour) {
        // sunrise 1
        mode = 'sunset-2'
      } else if (segment.time > sunsetHour) {
        // sunrise 1
        mode = 'night'
      } else {
        // day
      }
      segment.mode = mode
    })

    // set Colors
    this.daySegments.map((segment: DaySegment) => {
      this.setColor(segment.id, segment.mode)
    })
  }

  /**
   * Day Segment Width is 40
   * 24h * 40  = 960 ticks
   * minutes per day: 1440
   * SVG Tick per Minutes: 960 / 1440 = 0.666
   *
   *  Example: 14.30 => 14h * 60m + 30m =  870m * 0.7 = 609
   *
   */
  setTimeMark() {
    const d = new Date()
    const hours = d.getHours()
    const minutes = d.getMinutes()
    const ticks = (hours * 60 + minutes) * 0.654 // ticks factor

    const lineHeight = 160

    // Draw line
    const x1 = ticks
    const x2 = ticks
    const y1 = 1
    const y2 = lineHeight
    const cx = ticks
    const cy = 1
    const time = this.getTimeStringFromDate(d)

    const line = document.getElementById('line-now')

    line.style.stroke = 'white'
    line.setAttribute('x1', String(x1))
    line.setAttribute('x2', String(x2))
    line.setAttribute('y1', String(y1))
    line.setAttribute('y2', String(y2))

    const knop = document.getElementById('line-now-knob')
    knop.setAttribute('cx', String(cx))
    knop.setAttribute('cy', String(cy))

    const timeText = document.getElementById('label-time-now')
    timeText.setAttribute('x', String(ticks - 25))
    timeText.setAttribute('y', '-15')

    timeText.textContent = time
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

  buildSegments() {
    const daySegments: DaySegment[] = []
    console.log('daySegments', daySegments)

    for (let i = 0; i < 24; i++) {
      const segment: DaySegment = {
        id: i,
        time: i,
        mode: 'night',
        active: false,
      }
      daySegments.push(segment)
    }
    this.daySegments = daySegments
  }

  updateSegments() {
    let actionActive = 0
    this.daySegments.map(segment => {
      const stringTime = this.timeString(segment.id, 0)
      let arm = 0
      let action = 0
      const timer = this.sonoffTimers.find(timer => timer.Time === stringTime)
      if (timer) {
        console.log('timer', timer)
        arm = timer.Arm
        action = timer.Action
      }
      console.log('arm', arm)
      console.log('actionActive', actionActive)

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

  getDefaultTimers() {
    const sonoffTimers: SonoffTimer[] = []
    console.log('sonoffTimers', sonoffTimers)

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

  resetSonoffTimers() {
    this.sonoffTimers = this.getDefaultTimers()
  }

  /**
   * first:
   * load sonoff Timers from Local Storage
   * if Local Storage is empty, return default Timers
   *
   * second:
   * if mqtt service is available, it gets the timer from mqtt
   *
   *
   */
  getSonoffTimers(): SonoffTimer[] {
    if (localStorage.getItem('sonoffTimers')) {
      const data: SonoffTimer[] = JSON.parse(localStorage.getItem('sonoffTimers'))
      if (data.length != 0) {
        return data
      } else return this.getDefaultTimers()
    } else return this.getDefaultTimers()
  }

  setTimers() {
    console.log('sonoffTimers', this.sonoffTimers)

    let previousActive = false
    let timerCount = 0
    this.daySegments.map(segment => {
      // Case 1
      // not > active
      // activate timer at this time

      // Case 2
      // active > active
      // change nothing

      // Case 3
      // active > not
      // deactivate timer at this time

      // Case 4
      // not > not
      // change nothing

      //  First ans last segment
      if (segment.id === 0 || segment.id === 23) {
        previousActive = segment.active
        const timer: SonoffTimer = {
          Arm: Number(segment.active),
          Mode: 0,
          Time: this.getLeadingZero(segment.time) + ':00',
          Window: 5,
          Days: '1111111',
          Repeat: 1,
          Output: 1,
          Action: Number(segment.active),
        }
        this.sonoffTimers[0] = timer
      } else if (segment.active === true && previousActive === false) {
        // Case 1
        // not > active
        // activate timer at this time
        timerCount++
        previousActive = true
        const timer: SonoffTimer = {
          Arm: 1,
          Mode: 0,
          Time: this.getLeadingZero(segment.time) + ':00',
          Window: 5,
          Days: '1111111',
          Repeat: 1,
          Output: 1,
          Action: 1,
        }
        this.sonoffTimers[timerCount] = timer
      } else if (segment.active === true && previousActive === true) {
        // Case 2 : active > active
        // change nothing
        previousActive = true
      } else if (segment.active === false && previousActive === true) {
        timerCount++

        // Case 3: active > not
        // deactivate timer at this time
        previousActive = false
        const timer: SonoffTimer = {
          Arm: 1,
          Mode: 0,
          Time: this.getLeadingZero(segment.time) + ':00',
          Window: 5,
          Days: '1111111',
          Repeat: 1,
          Output: 1,
          Action: 0,
        }
        this.sonoffTimers[timerCount] = timer
      } else if (segment.active === false && previousActive === true) {
        // Case 4: not > not
        // change nothing
        previousActive = false
      } else {
        //
      }
    })
    console.log('sonoffTimers', this.sonoffTimers)
  }

  cancel() {
    this.edit = false

    this.getSonoffTimers()
  }

  clear() {
    this.edit = false
    localStorage.removeItem('sonoffTimers')
    this.resetSonoffTimers()
    this.buildSegments()
    this.updateSegments()
  }

  save() {
    this.edit = false

    this.setTimers()
    localStorage.setItem('sonoffTimers', JSON.stringify(this.sonoffTimers))

    //  this.publishSonoffTimers()
  }

  timeString(hours, minutes) {
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

      this.setColors()
      this.setTimeMark()
      this.updateSegments()
    })
  }
}
