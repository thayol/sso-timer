import Transform from './transform.js'
import Championship from './championship.js'
import Data from './data.js'
import Day from './day.js'

export default class UI {
  static instance = null
  static updateFrequency = 500 // in ms

  constructor(rootObject) {
    this.rootObject = rootObject
    this.loadChampionships()
    this.start() // auto-start, might need some more thought
  }

  static init() {
    UI.instance = new UI(window.document)
  }

  loadResponseIntoData(response) {
    response.json().then(Data.init)
  }

  loadChampionships() {
    fetch(Data.championshipsURL).then(this.loadResponseIntoData)
  }

  start() {
    this.intervalId = setInterval(() => { UI.instance.update() }, UI.updateFrequency)
  }

  stop() {
    clearInterval(this.intervalId)
  }

  update() {
    if (!Data.isLoaded) { return }

    Day.update()

    let next = Championship.next

    if (Championship.last != next) {
      Championship.last = next
      this.updateChampionshipDetails(next)
      this.updateChampionshipTable(next)
    }

    this.updateTimer(next)
  }

  updateChampionshipDetails(next) {
    this.rootObject.getElementById('time').innerHTML = Transform.time(next.time)
    this.rootObject.getElementById('location').innerHTML = next.location
  }

  updateTimer(next) {
    let remaining = Transform.time(next.remaining) + ":" + Day.secondsUntilFullMinute
    this.rootObject.getElementById('timer').innerHTML = remaining
    this.rootObject.title = `${remaining} - ${next.location} - SSO Timer`
  }

  // TODO: refactor to builder
  updateChampionshipTable(next) {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    let table = ``
    for (const [day, details] of Object.entries(Data.championships)) {
      let dayContainer = `<h1 class="day-title">${weekdays[day]}</h1>`
      let dayContainerClasses = 'day-container'

      if (Day.today == day) {
        dayContainerClasses += ' today'
      }

      for (const [time, location] of Object.entries(details)) {
        let formattedTime = Transform.time(time)
        let classes = 'time-container'
        if (next.day == day && next.time == time) {
          classes += ' next-time'
        }

        dayContainer += `<li class="${classes}"><b class="time">${formattedTime}</b>: ${location}</li>`
      }

      table += `<div class="${dayContainerClasses}"><ul class="times">${dayContainer}</ul></div>`
    }

    document.getElementById('championships_table').innerHTML = table
  }
}
