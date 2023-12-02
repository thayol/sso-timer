export default class Transform {
  static championshipsToLocations(championships) {
    return Transform.unique(Transform.flatten(championships))
  }

  static flatten(object) {
    return Object.values(object).reduce((arr, t) => arr.concat(Object.values(t)), [])
  }

  static unique(array) {
    return [...new Set(array)]
  }

  static dropChampionshipsBefore(championshipsToday, time) {
    return Object.keys(championshipsToday).filter((t) => parseInt(t) >= time)
  }

  static time(time) {
    return Math.floor(time/60).toString().padStart(2, '0') + ":" + (time % 60).toString().padStart(2, '0')
  }

  static stopAtZero(number) {
    if (number > 0) {
      return number
    }

    return 0
  }
}
