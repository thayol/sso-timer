export default class Day {
  static date = new Date() // maybe easier to offset time zone later
  static names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

  static update() {
    Day.date = new Date()
  }

  static get today() {
    return Day.date.getDay()
  }

  static get tomorrow() {
    let day = Day.today + 1
    if (day > 6) day -= 7

    return day
  }

  static get secondsUntilFullMinute() {
    return (60 - Day.date.getSeconds()).toString().padStart(2, '0')
  }
 
  static get minutesPassedSinceMidnight() {
    return Day.date.getHours() * 60 + Day.date.getMinutes()
  }
}
