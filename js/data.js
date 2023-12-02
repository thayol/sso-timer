import Transform from './transform.js'
import Day from './day.js'

export default class Data {
  static championships = {}
  static championshipsURL = 'data/championships.json'
  static locations = []

  static get championshipsToday() {
    return Data.championships[Day.today]
  }

  static get isLoaded() {
    return Object.keys(Data.championships).length > 0
  }

  static init(json) {
    Data.championships = json
    Data.locations = Transform.championshipsToLocations(json)
  }
}
