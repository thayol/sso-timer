import Transform from './transform.js'
import Championship from './championship.js'
import Data from './data.js'
import Day from './day.js'

export default class UI {
  static instance = null
  static updateFrequency = 500 // in ms

  constructor(rootObject) {
    this.next = new Championship()
    this.rootObject = rootObject
    this.savedParanoiaOffset = localStorage.getItem('paranoiaOffset') || 1
    this.#setParanoiaOffset(this.savedParanoiaOffset)
    this.#loadChampionships()
    this.start()
  }

  static init() {
    UI.instance = new UI(window.document)
  }

  get paranoiaOffset() {
    let currentParanoiaOffset = this.rootObject.getElementById('paranoia').value
    if (this.savedParanoiaOffset != currentParanoiaOffset) {
      localStorage.setItem('paranoiaOffset', currentParanoiaOffset)
    }

    return currentParanoiaOffset
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

    this.next = Championship.next

    if (Championship.nextChanged) {
      this.#updateChampionshipDetails()
      this.#updateChampionshipTable()
    }

    this.#updateTimer()
  }

  #setParanoiaOffset(value) {
    this.rootObject.getElementById('paranoia').value = value
  }

  #loadResponseIntoData(response) {
    response.json().then(Data.init)
  }

  #loadChampionships() {
    fetch(Data.championshipsURL).then(this.#loadResponseIntoData)
  }

  #updateChampionshipDetails() {
    this.rootObject.getElementById('time').innerHTML = Transform.time(this.next?.time)
    this.rootObject.getElementById('location').innerHTML = this.next?.location
  }

  #updateTimer() {
    let remaining = this.next?.remaining - this.paranoiaOffset
    let formattedRemaining = '00:00:00'
    if (remaining >= 0) {
      formattedRemaining = Transform.time(remaining) + ":" + Day.secondsUntilFullMinute
    }

    this.rootObject.getElementById('timer').innerHTML = formattedRemaining
    this.rootObject.title = `${formattedRemaining} - ${this.next?.location} - SSO Timer`
  }

  #updateChampionshipTable() {
    document.getElementById('championships_table').innerHTML = this.#buildChampionshipTable()
  }

  #buildChampionshipTable() {
    return Object.entries(Data.championships).map((dayDetails) => this.#buildChampionshipDay(dayDetails)).join('')
  }

  #buildChampionshipDay(dayDetails) {
    const [day, details] = dayDetails
    let dayContainer = `<h1 class="day-title">${Day.names[day]}</h1>`
    dayContainer += this.#buildChampionshipTimes(day, details)
    
    let dayContainerClasses = 'day-container' + ((Day.today == day) ? ' today' : '')
    return `<div class="${dayContainerClasses}"><ul class="times">${dayContainer}</ul></div>`
  }

  #buildChampionshipTimes(day, details) {
    return Object.entries(details).map((entry) => this.#buildChampionshipTime(day, entry)).join('')
  }

  #buildChampionshipTime(day, entry) {
    const [time, location] = entry

    let classes = 'time-container' + ((this.next?.day == day && this.next?.time == time) ? ' next-time' : '')
    return `<li class="${classes}"><b class="time">${Transform.time(time)}</b>: ${location}</li>`
  }
}
