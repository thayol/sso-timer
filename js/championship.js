import Data from './data.js'
import Day from './day.js'
import Transform from './transform.js'

export default class Championship {
  static last = null

  static get next() {
    let remainingOffset = 0
    let day = Day.today
    let time = Championship.nextTime

    if (time == null) {
      remainingOffset += 1440
      day = Day.tomorrow
      time = Championship.firstTimeNextDay
    }

    return {
      day: day,
      time: time,
      location: Data.championships[day][time],
      remaining: (remainingOffset + time) - Day.minutesPassedSinceMidnight,
    }
  }

  static get nextChanged() {
    if (Championship.last?.day != Championship.next?.day || Championship.last?.time != Championship.next?.time) {
      Championship.last = Championship.next
      return true
    }
  }

  static firstTimeOnDay(day) {
    return Math.min(...Object.keys(Data.championships[day]))
  }

  static get nextTime() {
    let nextTimes = Transform.dropChampionshipsBefore(Data.championshipsToday, Day.minutesPassedSinceMidnight)

    if (nextTimes.length < 1) {
      return null
    }

    return Math.min(...nextTimes)
  }
  
  static get firstTimeTomorrow() {
    return Championship.firstTimeOnDay(Day.tomorrow)
  }
}
