import { Component, OnInit } from '@angular/core'
import { getSunrise, getSunset } from 'sunrise-sunset-js'
import { SonoffTimer } from '../_models/sonoffTimer'
// import { faCheck, faTimes, faSpinner, faTrash} from '@fortawesome/pro-light-svg-icons';
import { faCheck, faTimes, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons'

interface DaySegment {
  id: number
  time: number
  active: boolean
  mood: 'night' | 'sunset-1' | 'sunset-2' | 'day' | 'sunrise-1' | 'sunrise-2'
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

    document.getElementById('hour-' + nr).style.fill = color
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
    const lineHeight = 160

    // position points
    const x1 = ticks
    const x2 = ticks
    const y1 = 1
    const y2 = lineHeight
    const cx = ticks
    const cy = 1

    // Current Time in format hh:mm
    const timeString = this.getTimeStringFromDate(d)

    // get Line ref
    const line = document.getElementById('line-now')

    // transfom Line to new location
    line.style.stroke = 'white'
    line.setAttribute('x1', String(x1))
    line.setAttribute('x2', String(x2))
    line.setAttribute('y1', String(y1))
    line.setAttribute('y2', String(y2))

    // draw some little Circle on top of the line
    const knop = document.getElementById('line-now-knob')
    knop.setAttribute('cx', String(cx))
    knop.setAttribute('cy', String(cy))

    // Add text "hh:mm" on top of the line
    const timeText = document.getElementById('label-time-now')
    timeText.setAttribute('x', String(ticks - 25))
    timeText.setAttribute('y', '-15')
    timeText.textContent = timeString
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
    let timers: [{ time: string; action: 'on' | 'off' | 'unchanged' }]

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

      const timer = {
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
        console.log(time + ':  on')
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
        console.log(time + ':  off')
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

    //  this.publishSonoffTimers()
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
