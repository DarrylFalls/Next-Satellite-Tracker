


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
    .then((result) => { return result.json() })
    .then((resultJSON) => {
      console.log(resultJSON)
    })
    .catch((error) => {
      console.log(`ERROR: ${error}`)
    })
}