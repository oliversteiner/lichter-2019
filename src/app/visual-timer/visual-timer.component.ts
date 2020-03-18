import { Component, OnInit } from '@angular/core'
import { getSunrise, getSunset } from 'sunrise-sunset-js'

interface DaySegment {
  id: number
  time: number
  active: boolean
  mode: 'night' | 'dawn-1' | 'dawn-2' | 'day' | 'dusk-1' | 'dusk-2'
}

@Component({
  selector: 'app-visual-timer',
  templateUrl: './visual-timer.component.html',
  styleUrls: ['./visual-timer.component.scss'],
})
export class VisualTimerComponent implements OnInit {
  private sunset: Date
  private sunrise: Date

  sunsetTime = '00:00'
  sunriseTime = '00:00'

  colorDay = '#F0B046'
  colorNight = '#005FC7'
  colorDawn1 = '#6F929C'
  colorDawn2 = '#B2AF8D'
  colorDusk1 = '#B2AF8D'
  colorDusk2 = '#6F929C'

  circleColorActive = 'white'
  circleColorHover = 'white'
  circleColorInactive = '#202020'

  circleOpacityActive = '1'
  circleOpacityHover = '0.5'
  circleOpacityInactive = '0.2'

  daySegments: DaySegment[] = [
    { id: 0, time: 0, active: false, mode: 'night' },
    { id: 1, time: 1, active: false, mode: 'night' },
    { id: 2, time: 2, active: false, mode: 'night' },
    { id: 3, time: 3, active: false, mode: 'night' },
    { id: 4, time: 4, active: false, mode: 'night' },
    { id: 5, time: 5, active: false, mode: 'night' },
    { id: 6, time: 6, active: false, mode: 'night' },
    { id: 7, time: 7, active: false, mode: 'dawn-1' },
    { id: 8, time: 8, active: false, mode: 'dawn-2' },
    { id: 9, time: 9, active: false, mode: 'day' },
    { id: 10, time: 10, active: false, mode: 'day' },
    { id: 11, time: 11, active: false, mode: 'day' },
    { id: 12, time: 12, active: false, mode: 'day' },
    { id: 13, time: 13, active: false, mode: 'day' },
    { id: 14, time: 14, active: false, mode: 'day' },
    { id: 15, time: 15, active: false, mode: 'day' },
    { id: 16, time: 16, active: false, mode: 'day' },
    { id: 17, time: 17, active: false, mode: 'dusk-1' },
    { id: 18, time: 18, active: false, mode: 'dusk-2' },
    { id: 19, time: 19, active: false, mode: 'night' },
    { id: 20, time: 20, active: false, mode: 'night' },
    { id: 21, time: 21, active: false, mode: 'night' },
    { id: 22, time: 22, active: false, mode: 'night' },
    { id: 23, time: 23, active: false, mode: 'night' },
  ]

  click(nr: number) {
    console.log('click', nr)

    this.toggle(nr)
  }

  over(nr: number) {
    console.log('over', nr)
    if (!this.daySegments[nr].active) {
      document.getElementById('oval-' + nr).style.fill = this.circleColorHover
      document.getElementById('oval-' + nr).style.fillOpacity = this.circleOpacityHover
    }
  }

  out(nr: number) {
    console.log('out', nr)
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

    // Debug
    console.log('list', this.daySegments)
  }

  setInactive(nr: number) {
    // State
    this.daySegments[nr].active = false

    // Visual
    document.getElementById('oval-' + nr).style.fill = this.circleColorInactive
    document.getElementById('oval-' + nr).style.fillOpacity = this.circleOpacityInactive

    // Debug
    console.log('list', this.daySegments)
  }

  toggle(nr) {
    if (this.daySegments[nr].active) {
      this.setInactive(nr)
    } else {
      this.setActive(nr)
    }
  }

  setColor(nr: number, mode) {
    let color = 'white'
    switch (mode) {
      case 'day':
        color = this.colorDay
        break
      case 'night':
        color = this.colorNight
        break
      case 'dawn-1':
        color = this.colorDawn1
        break
      case 'dawn-2':
        color = this.colorDawn2
        break
      case 'dusk-1':
        color = this.colorDusk1
        break
      case 'dusk-2':
        color = this.colorDusk2
        break
      default:
        color = 'red'
    }

    document.getElementById('hour-' + nr).style.fill = color
  }

  setColors() {
    this.daySegments.map((segment: DaySegment) => {
      this.setColor(segment.id, segment.mode)
    })
  }

  /**
   * Day Segment Width : 40
   * 24 * 40 = 960
   * minutes per day: 1440
   * SVG Tick per Minutes: 960 / 1440 = 0.7
   *
   *  14.30 => 14h * 60m + 30m =  870m * 0.7 = 609
   */
  setTimeMark() {
    const d = new Date()
    const hours = d.getHours()
    const minutes = d.getMinutes()
    const ticks = (hours * 60 + minutes) * 0.7

    const lineHeight = 160

    // Draw line
    const x1 = ticks
    const x2 = ticks
    const y1 = 1
    const y2 = lineHeight
    const cx = ticks
    const cy = 1
    const time = this.timeString(d)

    console.log('hours', hours)
    console.log('minutes', minutes)
    console.log('ticks', ticks)

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

  minutes(date) {
    return (date.getMinutes() < 10 ? '0' : '') + date.getMinutes()
  }

  hours(date) {
    return (date.getHours() < 10 ? '0' : '') + date.getHours()
  }

  timeString(date) {
    const h = this.hours(date)
    const min = this.minutes(date)
    return h + ':' + min
  }

  ngOnInit(): void {
    this.setColors()
    this.setTimeMark()

    navigator.geolocation.getCurrentPosition(position => {
      console.log(getSunset(position.coords.latitude, position.coords.longitude))
      this.sunset = getSunset(position.coords.latitude, position.coords.longitude)
      this.sunrise = getSunrise(position.coords.latitude, position.coords.longitude)

      this.sunsetTime = this.timeString(this.sunset)
      this.sunriseTime = this.timeString(this.sunrise)
    })
  }
}
