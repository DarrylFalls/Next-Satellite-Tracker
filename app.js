


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
  differentSatellites(data)
  getDate(data.culmination)
  clearSearch()
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
  let oldDate = document.querySelector('.date')
  if (oldDate !== null) {
    oldDate.remove()
  }
  const dt = data.utc_datetime
  const year = `${dt[0]}${dt[1]}${dt[2]}${dt[3]}`
  const month = `${dt[5]}${dt[6]}`
  const day = `${dt[8]}${dt[9]}`
  const date = `${month}/${day}/${year}`
  const addDate = document.createElement('h2')
  document.querySelector('#skyline').style.textAlign = 'center'
  addDate.style.color = 'white'
  addDate.innerText = `${date}`
  document.body.querySelector('#skyline').append(addDate)
  addDate.className = 'date'
  document.querySelector('#skyline').style.display = 'flex'
  document.querySelector('#skyline').style.alignItems = 'flex-end'
  document.querySelector('#skyline').style.justifyContent = 'center'
  addDate.style.marginBottom = '0'
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
      visible: data.rise.visible,
    },
    {
      position: 'Culmination',
      alt: `${culmAlt}`,
      altPerc: culmPerc,
      az: data.culmination.az,
      direction: data.culmination.az_octant,
      time: getTime12(data.culmination),
      time24: getTime24(data.culmination),
      visible: data.culmination.visible,
    },
    {
      position: 'Set',
      alt: `${setAlt}`,
      altPerc: setPerc,
      az: data.set.az,
      direction: data.set.az_octant,
      time: getTime12(data.set),
      time24: getTime24(data.set),
      visible: data.set.visible,
    }
  ]
  console.log(satArr)
  let timeOfDay = satArr[1].time24[0]+satArr[1].time24[1]
  setBackground(timeOfDay)
  buildSatellites(satArr)
  moveSatelliteMain(satArr)
  buildCompass(satArr)
  buildInfoBox(satArr)

}

const buildInfoBox = (arr) => {
  const oldContainer = document.querySelector('#info-div')
  oldContainer.innerHTML = ''
  let div = document.querySelector('#info-div')

  // const satelliteKey = document.createElement('div')
  // div.appendChild(satelliteKey)

  // const visibleSat = document.createElement('img')
  // const notVisibleSat = document.createElement('img')
  // const visSatDesc = document.createElement('h3')
  // const notVisSatDesc = document.createElement('h3')

  // satelliteKey.appendChild(visibleSat)
  // satelliteKey.appendChild(visSatDesc)
  // satelliteKey.appendChild(notVisibleSat)
  // satelliteKey.appendChild(notVisSatDesc)
  
  // visibleSat.src = 'images/satellite.png'
  // notVisibleSat.src = 'images/satellite.png'
  // visibleSat.style.height = '40px'
  // visibleSat.style.width = '60px'
  // notVisibleSat.style.height = '40px'
  // notVisibleSat.style.width = '60px'
  // notVisibleSat.style.opacity = '0.5'

  // visSatDesc.innerText = '= Visible'
  // visSatDesc.style.display = 'inline'

  // notVisSatDesc.innerText = '= Not Visible'
  // notVisSatDesc.style.display = 'inline'
  

  // satelliteKey.style.display = 'flex'
  // satelliteKey.style.justifyContent = 'center'


  for (i = 0; i < arr.length; i++){
    const container = document.createElement('div')
    container.className = 'container'
    const newDiv = document.createElement('div')
    newDiv.setAttribute('id', `${arr[i].position}`)
    const label = document.createElement('h2')
    label.for = `${arr[i].position}`
    // label.innerText = `${arr[i].position}`
    if (window.innerWidth > 600) {
      label.innerText = `${arr[i].position}`
    } else if (arr[i].position == 'Culmination') {
      label.innerText = 'Apex'
    } else {
      label.innerText = `${arr[i].position}`
    }
    div.appendChild(container)
    container.appendChild(label)
    container.appendChild(newDiv)
    label.style.fontSize = '150%'
    

    container.style.background = 'rgba(3, 2, 44, 0.7)'
    div.style.color = 'white'
    container.style.display = 'flex'
    container.style.justifyContent = 'space-evenly'
    container.style.alignItems = 'center'
    container.style.marginBottom = '2%'
    container.style.marginLeft = '15%'
    container.style.marginRight = '15%'
    container.style.borderRadius = '15px'
    

    const time = document.createElement('p')
    const alt = document.createElement('p')
    const az = document.createElement('p')
    const direction = document.createElement('p')
    const visible = document.createElement('p')

    newDiv.appendChild(time)
    newDiv.appendChild(alt)
    newDiv.appendChild(az)
    newDiv.appendChild(direction)
    newDiv.appendChild(visible)

    if (window.innerWidth > 600) {
      time.innerText = `Time (12h): ${arr[i].time}`
    } else {
      time.innerText = `Time (24h): ${arr[i].time24}`
    }
    alt.innerText = `Altitude: ${arr[i].alt}°`
    az.innerText = `Azimuth: ${arr[i].az}°`
    direction.innerText = `Compass Direction: ${arr[i].direction}`
    visible.innerText = `Satellite is Visible: ${arr[i].visible}`
  }


}




const buildCompass = (arr) => {
  const compass = document.createElement('img')
  document.querySelector('#compass-div').appendChild(compass)
  compass.src = 'images/compass.png'
  compass.style.height = '100px'
  compass.style.width = '100px'
  compass.style.position = 'center'
  compass.className = 'compass'
  compass.animate([{ transform: `rotate(${360 - (arr[1].az)}deg)` }], {
    duration: 1500,
    iterations: 1
  })
  setTimeout(() => {
    compass.style.transform = `rotate(${360 - (arr[1].az)}deg)`
  }, 1499)
  // compass.style.transform = `rotate(${360 - (arr[1].az)}deg)`
  console.log(arr[1].az)
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
    container.style.marginBottom = `${450 * sat.altPerc}px`
    container.style.display = 'flex'
    container.style.flexDirection = 'column'
    container.style.alignItems = 'center'
    
    // const img = document.createElement('img')
    // container.appendChild(img)
    // img.src = 'images/satellite.png'
    // img.style.width = '100%'
    // img.style.height = '80%'
    // if (sat.visible == false) {
    //   img.style.opacity = '0.3'
    // }

    

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
      altitude.innerText = `${sat.alt}°`
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
    skyline.style.width = '100%'
    skyline.style.height = '20%'
    skyline.style.position = 'absolute'
    skyline.style.bottom = '0'
    skyline.style.left = '0'
    skyline.style.backgroundSize = 'contain'
    skyline.style.backgroundRepeat = 'repeat-x'
    skyline.style.zIndex = '8'
  }
}

const clearSearch = () => {
  let old = document.querySelector('#location')
  old.value = ''
}

const moveSatelliteMain = (arr) => {
  let order = getSatOrder(arr)
  if (order == 123) {
    moveRight(arr)
  } else if (order == 321) {
    moveLeft(arr)
  }
}

const moveRight = (arr) => {
  const old = document.querySelector('.moving-sat')
  if (old !== null) {
    old.remove()
  }
  console.log('move right')
  const area = document.querySelector('#motion-area')
  const sat = document.createElement('img')
  sat.src = 'images/satellite.png'
  sat.style.height = '50px'
  sat.style.width = '60px'
  sat.className = 'moving-sat'
  area.appendChild(sat)
  
  let x = 0
  let y = 0
  let z = window.innerWidth-65
  
  setInterval(() => {
    // if (x == (z)) {
    //   x = 0
    //   y = 0
    // } else if (x >= (z * (7 / 8))) {
    //   if (x % 10 == 0) {
    //     y-=(positionOneInterval(arr))
    //   }
    //   x++
    //   sat.style.marginBottom = y + "px";
    //   sat.style.marginLeft = x + "px";
    // } else if (x >= (z * (6 / 8))) {
    //   if (x % 10 == 0) {
    //     y-=(positionTwoInterval(arr))
    //   }
    //   x++
    //   sat.style.marginBottom = y + "px";
    //   sat.style.marginLeft = x + "px";
    // } else if (x >= (z * (5 / 8))) {
    //   if (x % 10 == 0) {
    //     y-=(positionThreeInterval(arr))
    //   }
    //   x++
    //   sat.style.marginBottom = y + "px";
    //   sat.style.marginLeft = x + "px";
    // } else if (x >= (z * (4 / 8))) {
    //   if (x % 10 == 0) {
    //     y-=(positionFourInterval(arr))
    //   }
    //   x++
    //   sat.style.marginBottom = y + "px";
    //   sat.style.marginLeft = x + "px";
    // } else if (x >= (z * (3 / 8))) {
    //   if (x % 10 == 0) {
    //     y+=(positionFourInterval(arr))
    //   }
    //   x++
    //   sat.style.marginBottom = y + "px";
    //   sat.style.marginLeft = x + "px";
    // } else if (x >= (z * (2 / 8))) {
    //   if (x % 10 == 0) {
    //     y+=(positionThreeInterval(arr))
    //   }
    //   x++
    //   sat.style.marginBottom = y + "px";
    //   sat.style.marginLeft = x + "px";
    // } else if (x >= (z * (1 / 8))) {
    //   if (x % 10 == 0) {
    //     y+=(positionTwoInterval(arr))
    //   }
    //   x++
    //   sat.style.marginBottom = y + "px";
    //   sat.style.marginLeft = x + "px";
    // } else {
    //   if (x % 10 == 0) {
    //     y+=(positionOneInterval(arr))
    //   }
    //   x++
    //   sat.style.marginBottom = y + "px";
    //   sat.style.marginLeft = x + "px";
    // }
    if (x == (z)) {
      x = 0
      y = 0
    } else if (x >= (z * (3 / 4))) {
      if (x % 10 == 0) {
        y -= (interval1(arr))
      }
      x++
      sat.style.marginBottom = y + "px";
      sat.style.marginLeft = x + "px";
    } else if (x >= (z * (2 / 4))) {
      if (x % 10 == 0) {
        y-= (interval2(arr))
      }
      x++
      sat.style.marginBottom = y + "px";
      sat.style.marginLeft = x + "px";
    } else if (x >= (z * (1 / 4))) {
      if (x % 10 == 0) {
        y+= (interval2(arr))
      }
      x++
      sat.style.marginBottom = y + "px";
      sat.style.marginLeft = x + "px";
    } else {
      if (x % 10 == 0) {
        y += (interval1(arr))
      }
      x++
      sat.style.marginBottom = y + "px";
      sat.style.marginLeft = x + "px";
    }
  }, 5)
}

const moveLeft = (arr) => {
  const old = document.querySelector('.moving-sat')
  if (old !== null) {
    old.remove()
  }
  console.log('move left')
  const area = document.querySelector('#motion-area')
  const sat = document.createElement('img')
  sat.src = 'images/satellite.png'
  sat.style.height = '50px'
  sat.style.width = '60px'
  sat.className = 'moving-sat'
  area.appendChild(sat)
  let z = window.innerWidth-65
  let x = z
  let y = 0
  
  setInterval(() => {
    // if (x == 0) {
    //   x = z
    //   y = 0
    // } else if (x <= (z * (1/8))) {
    //   if (x % 10 == 0) {
    //     y-=(positionOneInterval(arr))
    //   }
    //   x--
    //   sat.style.marginBottom = y + "px";
    //   sat.style.marginLeft = x + "px";
    // } else if (x <= (z * (2 / 8))) {
    //   if (x % 10 == 0) {
    //     y-=(positionTwoInterval(arr))
    //   }
    //   x--
    //   sat.style.marginBottom = y + "px";
    //   sat.style.marginLeft = x + "px";
    // } else if (x <= (z * (3 / 8))) {
    //   if (x % 10 == 0) {
    //     y-=(positionThreeInterval(arr))
    //   }
    //   x--
    //   sat.style.marginBottom = y + "px";
    //   sat.style.marginLeft = x + "px";
    // }else if (x <= (z * (4/8))) {
    //   if (x % 10 == 0) {
    //     y-=(positionFourInterval(arr))
    //   }
    //   x--
    //   sat.style.marginBottom = y + "px";
    //   sat.style.marginLeft = x + "px";
    // } else if (x <= (z * (5 / 8))) {
    //   if (x % 10 == 0) {
    //     y+=(positionFourInterval(arr))
    //   }
    //   x--
    //   sat.style.marginBottom = y + "px";
    //   sat.style.marginLeft = x + "px";
    // } else if (x <= (z * (6 / 8))) {
    //   if (x % 10 == 0) {
    //     y+=(positionThreeInterval(arr))
    //   }
    //   x--
    //   sat.style.marginBottom = y + "px";
    //   sat.style.marginLeft = x + "px";
    // } else if (x <= (z * (7 / 8))) {
    //   if (x % 10 == 0) {
    //     y+=(positionTwoInterval(arr))
    //   }
    //   x--
    //   sat.style.marginBottom = y + "px";
    //   sat.style.marginLeft = x + "px";
    // } else {
    //   if (x % 10 == 0) {
    //     y+=(positionOneInterval(arr))
    //   }
    //   x--
    //   sat.style.marginBottom = y + "px";
    //   sat.style.marginLeft = x + "px";
    // }
    if (x == 0) {
      x = z
      y = 0
    } else if (x <= (z * (1 / 4))) {
      if (x % 10 == 0) {
        y -= (interval1(arr))
      }
      x--
      sat.style.marginBottom = y + "px";
      sat.style.marginLeft = x + "px";
    } else if (x <= (z * (2 / 4))) {
      if (x % 10 == 0) {
        y-= (interval2(arr))
      }
      x--
      sat.style.marginBottom = y + "px";
      sat.style.marginLeft = x + "px";
    } else if (x <= (z * (3 / 4))) {
      if (x % 10 == 0) {
        y+= (interval2(arr))
      }
      x--
      sat.style.marginBottom = y + "px";
      sat.style.marginLeft = x + "px";
    } else {
      if (x % 10 == 0) {
        y += (interval1(arr))
      }
      x--
      sat.style.marginBottom = y + "px";
      sat.style.marginLeft = x + "px";
    }
  }, 5)
  
}


// const positionOneInterval = (arr) => {
//   const windowWidth = window.innerWidth - 65
//   const windowHeight = 450
//   const x = windowWidth/2
//   const y = 450 * (arr[1].altPerc)
//   const L = (x - y) / 4
//   const c1 = (y+(3*L))
//   const b1 = (3 / 4) * x
//   const a1 = Math.sqrt((c1 * c1) - (b1 * b1))
//   const interval = Math.round((a1/((1/4)*x))*10)
//   return interval
// }

// const positionTwoInterval = (arr) => {
//   const windowWidth = window.innerWidth - 65
//   const windowHeight = 450
//   const x = windowWidth/2
//   const y = 450 * (arr[1].altPerc)
//   const L = (x - y) / 4
//   const c1 = y + (2 * L)
//   const b1 = ((1 / 2) * x)
//   const a1 = Math.sqrt((c1 * c1) - (b1 * b1))
//   const c2 = (y+(3*L))
//   const b2 = (3 / 4) * x
//   const a2 = Math.sqrt((c2 * c2) - (b2 * b2))
//   const interval = Math.round(((a1 - a2)/((1 / 4) * x))*10)
//   return interval
// }

const interval1 = (arr) => {
  const windowWidth = window.innerWidth - 65
  const windowHeight = 450
  const x = windowWidth/2
  const y = 450 * (arr[1].altPerc)
  const L = (x - y) / 4
  const c1 = y + (2 * L)
  const b1 = ((2 / 4) * x)
  const a1 = Math.sqrt((c1 * c1) - (b1 * b1))
  const interval = Math.round((a1/((1/2)*x))*5)
  return interval
}

const interval2 = (arr) => {
  const windowWidth = window.innerWidth - 65
  const windowHeight = 450
  const x = windowWidth/2
  const y = 450 * (arr[1].altPerc)
  const L = (x - y) / 4
  const a1 = y
  const c2 = y + (2 * L)
  const b2 = ((2 / 4) * x)
  const a2 = Math.sqrt((c2 * c2) - (b2 * b2))
  const interval = Math.round((a1/((1/2)*x))*5)
  return interval

}

// const positionThreeInterval = (arr) => {
//   const windowWidth = window.innerWidth - 65
//   const windowHeight = 450
//   const x = windowWidth/2
//   const y = 450 * (arr[1].altPerc)
//   const L = (x - y) / 4
//   const c1 = y + L
//   const b1 = (1 / 4) * x
//   const a1 = Math.sqrt((c1 * c1) - (b1 * b1))
//   const c2 = y + (2 * L)
//   const b2 = ((1 / 2) * x)
//   const a2 = Math.sqrt((c2 * c2) - (b2 * b2))
//   const interval = Math.round(((a1 - a2)/((1 / 4) * x))*10)
//   return interval
// }

// const positionFourInterval = (arr) => {
//   const windowWidth = window.innerWidth - 65
//   const windowHeight = 450
//   const x = windowWidth/2
//   const y = 450 * (arr[1].altPerc)
//   const L = (x - y) / 4
//   const a1 = y
//   const c2 = y + L
//   const b2 = (1 / 4) * x
//   const a2 = Math.sqrt((c2 * c2) - (b2 * b2))
//   const interval = Math.round(((a1 - a2)/((1 / 4) * x))*10)
//   return interval
// }

// const positionFiveInterval = (arr) => {
//   const windowWidth = window.innerWidth - 65
//   const windowHeight = 450
//   const x = windowWidth/2
//   const y = 450 * (arr[1].altPerc)
//   const L = (x - y) / 4
// }

// const positionSixInterval = (arr) => {
//   const windowWidth = window.innerWidth - 65
//   const windowHeight = 450
//   const x = windowWidth/2
//   const y = 450 * (arr[1].altPerc)
//   const L = (x - y) / 4
// }

// const positionSevenInterval = (arr) => {
//   const windowWidth = window.innerWidth - 65
//   const windowHeight = 450
//   const x = windowWidth/2
//   const y = 450 * (arr[1].altPerc)
//   const L = (x - y) / 4
//   const c1 = (y+(3*L))
//   const b1 = (3 / 4) * x
//   const a1 = Math.sqrt((c1 * c1) - (b1 * b1))
//   const interval = Math.floor(a1/((1/4)*x))
//   return interval
// }
