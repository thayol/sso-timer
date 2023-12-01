var championships = {}
var lastChampionship = null
var locations = []
var updateFrequency = 500; // in ms

function flattenObjectIntoSingleUniqueArray(object) {
  return [...new Set(Object.values(object).reduce((arr, t) => arr.concat(Object.values(t)), []))]
}

function getDateObject() {
  return new Date() // maybe easier to offset time zone later
}

function currentDay() {
  return getDateObject().getDay()
}

function currentTime() {
  let date = getDateObject()
  return date.getHours() * 60 + date.getMinutes()
}

function nextDay() {
  let day = currentDay() + 1
  if (day > 6) day -= 6

  return day
}

function firstTimeOnDay(day) {
  return Math.min(...Object.keys(championships[day]))
}

function firstTimeNextDay() {
  return firstTimeOnDay(nextDay())
}

function nextTime() {
  let time = currentTime()

  let nextTimes = Object.keys(championships[currentDay()]).filter((t) => parseInt(t) >= time)
  
  if (nextTimes.length < 1) {
    return null
  }

  return Math.min(...nextTimes)
}

function formatTime(time) {
  return Math.floor(time/60).toString().padStart(2, '0') + ":" + (time % 60).toString().padStart(2, '0')
}

function formatSeconds() {
  return (60 - getDateObject().getSeconds()).toString().padStart(2, '0')
}

function nextChampionship() {
  let remainingOffset = 0
  let day = currentDay()
  let time = nextTime()

  if (time == null) {
    remainingOffset = 1440
    day = nextDay()
    time = firstTimeNextDay()
  }

  return {
    day: day,
    time: time,
    location: championships[day][time],
    remaining: (remainingOffset + time) - currentTime(),
  }
}

function updateChampionshipDetails(next) {
  document.getElementById('time').innerHTML = formatTime(next.time)
  document.getElementById('location').innerHTML = next.location
}

function updateTimer(next) {
  let remaining = formatTime(next.remaining) + ":" + formatSeconds()
  document.getElementById('timer').innerHTML = remaining
  document.title = `${remaining} - ${next.location} - SSO Timer`
}

function updateChampionshipTable(next) {
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  let table = ``
  for (const [day, details] of Object.entries(championships)) {
    let dayContainer = `<h1 class="day-title">${weekdays[day]}</h1>`
    let dayContainerClasses = 'day-container'

    if (currentDay() == day) {
      dayContainerClasses += ' today'
    }

    for (const [time, location] of Object.entries(details)) {
      let formattedTime = formatTime(time)
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

window.addEventListener('load', () => {
  fetch('data/championships.json').then((response) => {
    response.json().then((json) => {
      championships = json
      locations = flattenObjectIntoSingleUniqueArray(championships)
      
    })
  })

  setInterval(() => {
    if (championships.length < 1) {
      return
    }

    let next = nextChampionship()

    if (lastChampionship != nextChampionship()) {
      updateChampionshipDetails(next)
      updateChampionshipTable(next)
    }

    updateTimer(next)
  }, updateFrequency)
})
