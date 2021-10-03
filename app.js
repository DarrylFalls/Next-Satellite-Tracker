


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
  const display = document.querySelector('#action-area')
  console.log(getDate(data.culmination))
  differentSatellites(data)
}

const getTime = (data) => {
  const dt = data.utc_datetime
  const minute = `${dt[14]}${dt[15]}`
  const second = `${dt[17]}${dt[18]}`
  let pre = null
  let hourNum = null
  const getHour = (dt) => {
    let h = dt[11] + dt[12]
    let hInt = parseInt(h)
    if (hInt > 12) {
      hourNum = hInt - 12
      pre = 'PM'
    } else {
      hourNum = hInt
      pre = 'AM'
    }
    return `${pre} ${hourNum}`
  }
  const hour = getHour(dt)

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
  const risePerc = (riseAlt / 90) * 100
  const culmPerc = (culmAlt / 90) * 100
  const setPerc = (setAlt / 90) * 100
  const satList = [
    {
      position: 'Rise',
      alt: `${riseAlt}`,
      altPerc: risePerc,
      az: data.rise.az,
      direction: data.rise.az_octant,
      time: getTime(data.rise),
    },
    {
      position: 'Culmination',
      alt: `${culmAlt}`,
      altPerc: culmPerc,
      az: data.culmination.az,
      direction: data.culmination.az_octant,
      time: getTime(data.culmination),
    },
    {
      position: 'Set',
      alt: `${setAlt}`,
      altPerc: setPerc,
      az: data.set.az,
      direction: data.set.az_octant,
      time: getTime(data.set),
    }
  ]
  console.log(satList)
  const risingSat = document.createElement('div')
  const culmSat = document.createElement('div')
  const settingSat = document.createElement('div')
}

const buildSatellites = (arr) => {
  arr.forEach(sat => {
    
  });
}