


const searchButton = document.querySelector('button')
searchButton.addEventListener('click', () => {
  const input = document.querySelector('#location').value
  const locationKey = 'pk.9ef5062ddda432e353491dd453e38da9'
  const locationAPI = `https://us1.locationiq.com/v1/search.php?key=${locationKey}&q=${input}&format=json`
  fetch(`${locationAPI}`)
    .then((res) => { return res.json() })
    .then((resJSON) => {
      console.log(resJSON[0])
      satFetch(resJSON[0])
      setSkyline(resJSON[0])
    })
    .catch((error) => {
      console.log(`ERROR: ${error}`)
    })
})


const satFetch = (data) => {
  console.log(data)
  const lat = data.lat
  console.log(lat)
  const lon = data.lon
  console.log(lon)
  const satAPI = `https://satellites.fly.dev/passes/25544?lat=${lat}&lon=${lon}&limit=1`
  fetch(`${satAPI}`)
    .then((res) => { return res.json() })
    .then((resJSON) => {
      console.log(resJSON)
      addSatellites(resJSON[0])
    })
    // .catch((error) => {
    //   console.log(`ERROR: ${error}`)
    // })
}


const addSatellites = (data) => {
  removeOld()
  console.log(getDate(data.culmination))
  differentSatellites(data)
}

const getTime12 = (data) => {
  const dt = data.utc_datetime
  const minute = `${dt[14]}${dt[15]}`
  const second = `${dt[17]}${dt[18]}`
  let pre = null
  let hourNum = null
  let h = dt[11] + dt[12]
  if (h > 12) {
    if (h < 22) {
      hourNum = `0${h - 12}`
      pre = 'PM'
    } else {
      hourNum = h - 12
      pre = 'PM'
    }
  } else {
    hourNum = h
    pre = 'AM'
  }
  

  let time = `${hourNum}:${minute}:${second} ${pre}`

  return time
}

const getTime24 = (data) => {
  const dt = data.utc_datetime
  const minute = `${dt[14]}${dt[15]}`
  const second = `${dt[17]}${dt[18]}`
  let hour = dt[11] + dt[12]
  let time = `${hour}:${minute}:${second}`

  return time
}

const getDate = (data) => {
  const dt = data.utc_datetime
  const year = `${dt[0]}${dt[1]}${dt[2]}${dt[3]}`
  const month = `${dt[5]}${dt[6]}`
  const day = `${dt[8]}${dt[9]}`
  return `${month}/${day}/${year}`
}

const differentSatellites = (data) => {
  console.log(data)
  const riseAlt = data.rise.alt
  const culmAlt = data.culmination.alt
  const setAlt = data.set.alt
  const risePerc = (Math.floor((riseAlt / 90) * 10000) / 10000)
  const culmPerc = (Math.floor((culmAlt / 90) * 10000) / 10000)
  const setPerc = (Math.floor((setAlt / 90) * 10000) / 10000)
  const satArr = [
    {
      position: 'Rise',
      alt: `${riseAlt}`,
      altPerc: risePerc,
      az: data.rise.az,
      direction: data.rise.az_octant,
      time: getTime12(data.rise),
      time24: getTime24(data.rise),
      visible: data.rise.is_sunlit,
    },
    {
      position: 'Culmination',
      alt: `${culmAlt}`,
      altPerc: culmPerc,
      az: data.culmination.az,
      direction: data.culmination.az_octant,
      time: getTime12(data.culmination),
      time24: getTime24(data.culmination),
      visible: data.culmination.is_sunlit,
    },
    {
      position: 'Set',
      alt: `${setAlt}`,
      altPerc: setPerc,
      az: data.set.az,
      direction: data.set.az_octant,
      time: getTime12(data.set),
      time24: getTime24(data.set),
      visible: data.set.is_sunlit,
    }
  ]
  console.log(satArr)
  let timeOfDay = satArr[1].time24[0]+satArr[1].time24[1]
  setBackground(timeOfDay)
  buildSatellites(satArr)
  
  const compass = document.createElement('img')
  document.querySelector('#compass-div').appendChild(compass)
  compass.src = 'images/compass.png'
  compass.style.height = '100px'
  compass.style.width = '100px'
  compass.style.position = 'center'
  compass.className = 'compass'
  compass.style.transform = `rotate(${360 - (satArr[1].az)}deg)`
  console.log(satArr[1].az)

}

const buildSatellites = (arr) => {
  let satOrder = getSatOrder(arr)
  arr.forEach(sat => {
    const container = document.createElement('div')
    if (sat.position == 'Culmination') {
      document.querySelector('#action-center').appendChild(container)
    } else if (sat.position == 'Rise' && satOrder == 123) {
      document.querySelector('#action-left').appendChild(container)
    } else if (sat.position == 'Rise' && satOrder == 321) {
      document.querySelector('#action-right').appendChild(container)
    } else if (sat.position == 'Set' && satOrder == 123) {
      document.querySelector('#action-right').appendChild(container)
    } else if (sat.position == 'Set' && satOrder == 321) {
      document.querySelector('#action-left').appendChild(container)
    }
    
    container.className = 'satellite'
    container.id = `${sat.position}`
    container.style.height = '50px'
    container.style.width = '50px'
    // container.style.background = `url(images/satellite.png)`
    // container.style.backgroundSize = 'contain'
    // container.style.backgroundRepeat = 'no-repeat'
    container.style.marginBottom = `${450 * sat.altPerc}px`
    container.style.display = 'flex'
    container.style.flexDirection = 'column'
    container.style.alignItems = 'center'
    
    const img = document.createElement('img')
    container.appendChild(img)
    img.src = 'images/satellite.png'
    img.style.width = '100%'
    img.style.height = '80%'
    if (sat.visible == false) {
      img.style.opacity = '0.3'
    }

    

    // smallInfoBox.style.transform = 'rotate(90deg)'

    if (window.innerWidth > 600) {
      const smallInfoBox = document.createElement('div')
    container.appendChild(smallInfoBox)
    smallInfoBox.style.background = 'rgba(200, 200, 200, 0.7)'
    smallInfoBox.style.width = '200%'
    smallInfoBox.style.textAlign = 'center'

    const place = document.createElement('p')
    smallInfoBox.appendChild(place)
    place.innerText = `${sat.position}`
    place.style.color = 'white'
    place.style.marginBottom = '0'
    place.style.marginTop = '0'

    const time = document.createElement('p')
    smallInfoBox.appendChild(time)
    time.innerText = `${sat.time}`
    time.style.color = 'white'
    time.style.marginTop = '0'
    time.style.marginBottom = '0'

    const altitude = document.createElement('p')
    smallInfoBox.appendChild(altitude)
    altitude.innerText = `${sat.alt} degrees`
    altitude.style.color = 'white'
    altitude.style.marginTop = '0'
    altitude.style.marginBottom = '0'
    } else {
      const smallInfoBox = document.createElement('div')
      container.appendChild(smallInfoBox)
      smallInfoBox.style.background = 'rgba(200, 200, 200, 0.7)'
      smallInfoBox.style.width = '100%'
      smallInfoBox.style.textAlign = 'center'

      const place = document.createElement('p')
      smallInfoBox.appendChild(place)
      if (sat.position == 'Culmination') {
        place.innerText = 'Apex'
      } else {
        place.innerText = `${sat.position}`
      }
      place.style.color = 'white'
      place.style.marginBottom = '0'
      place.style.marginTop = '0'

      const time = document.createElement('p')
    smallInfoBox.appendChild(time)
    time.innerText = `${sat.time24[0]}${sat.time24[1]}${sat.time24[2]}${sat.time24[3]}${sat.time24[4]}`
    time.style.color = 'white'
    time.style.marginTop = '0'
    time.style.marginBottom = '0'

      const altitude = document.createElement('p')
    smallInfoBox.appendChild(altitude)
    altitude.innerText = `${sat.alt}°`
    altitude.style.color = 'white'
    altitude.style.marginTop = '0'
    altitude.style.marginBottom = '0'
    }
  });
}

const setBackground = (time) => {
  const background = document.querySelector('#action-area')
  if (time >= 20 || time <= 5) {
    background.style.background = `url(images/night-sky.jpg)`
  } else if (time < 19 && time > 6) {
    background.style.background = 'rgb(70, 104, 160)'
  } else if (time == 19) {
    background.style.background = 'linear-gradient(to top, rgb(177, 58, 2), rgb(46, 2, 97))'
  } else if (time == 6) {
    background.style.background = 'linear-gradient(to top, rgb(197, 139, 62), rgb(45, 47, 160))'
  }
}

const getSatOrder = (arr) => {
  let rise = arr[0].az
  let culm = arr[1].az
  let set = arr[2].az
  if (rise < culm && culm < set) {
    return 123
  } else if (set < culm && culm < rise) {
    return 321
  } else if (rise > culm && culm < set && rise > set) {
    return 123
  } else if (set > culm && rise > culm && set > rise) {
    return 321
  } else if (rise < culm && rise > set && culm > set) {
    return 123
  } else if (set < culm && set > rise && culm > rise) {
    return 321
  }
}

const removeOld = () => {
  const satellites = document.querySelectorAll('.satellite')
  // if (satellites.length > 0) {
  //   satellites.remove()
  // }
  satellites.forEach(satellite => {
    satellite.remove()
  })
  const compass = document.querySelector('.compass')
  if (compass !== null) {
    compass.remove()
  }
}

const setSkyline = (data) => {
  const skyline = document.querySelector('#skyline')
  const importance = data.importance
  console.log(importance)
  if (importance > 0.8) {
    skyline.style.background = `url(images/city.png)`
    skyline.style.width = '100%'
    skyline.style.height = '20%'
    skyline.style.position = 'absolute'
    skyline.style.bottom = '0'
    skyline.style.left = '0'
    skyline.style.backgroundSize = 'contain'
    skyline.style.backgroundRepeat = 'repeat-x'
    skyline.style.zIndex = '8'

  } else {
    skyline.style.background = ''
  }
}