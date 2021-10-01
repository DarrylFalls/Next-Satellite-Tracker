# Next-Satellite-Tracker

Description: web application to show when the next satellite will be passing over your location

Satellite Passes API:  https://satellites.fly.dev/
[
    {
        "rise": {
            "alt": "10.02",
            "az": "216.34",
            "az_octant": "SW",
            "utc_datetime": "2021-10-02 09:41:35.659823+00:00",
            "utc_timestamp": 1633167695,
            "is_sunlit": true,
            "visible": false
        },
        "culmination": {
            "alt": "25.57",
            "az": "158.44",
            "az_octant": "S",
            "utc_datetime": "2021-10-02 09:44:26.156665+00:00",
            "utc_timestamp": 1633167866,
            "is_sunlit": true,
            "visible": false
        },
        "set": {
            "alt": "10.00",
            "az": "100.69",
            "az_octant": "E",
            "utc_datetime": "2021-10-02 09:47:17.223249+00:00",
            "utc_timestamp": 1633168037,
            "is_sunlit": true,
            "visible": false
        },
        "visible": false
    }
]



Loction IQ API:  https://us1.locationiq.com/v1/search.php?key=[ACCESS KEY]&q=Raleigh&format=json
[
    {
        "place_id": "274525667",
        "licence": "https://locationiq.com/attribution",
        "osm_type": "relation",
        "osm_id": "179052",
        "boundingbox": [
            "35.7082575",
            "35.970736",
            "-78.8189744",
            "-78.4707917"
        ],
        "lat": "35.7803977",
        "lon": "-78.6390989",
        "display_name": "Raleigh, Wake County, North Carolina, USA",
        "class": "boundary",
        "type": "administrative",
        "importance": 0.7086350442672057,
        "icon": "https://locationiq.org/static/images/mapicons/poi_boundary_administrative.p.20.png"
    }
]


MVP List:
  //search bar that will let people search their location useing a geocache API
  //fetch that will use long & lat from geocahe API to pull info from satellite API
  //display that will show the angle the satellite will be in the sky and which compass direction
  //info box that will give all the information aout the satelite to the user
  //organize the page and the info box with flexbox
  
  
Post MVP List:
  //use animation for the satellite display
  //create suggestion dropdown for the search box
  //background of display will change based on time of day the satellite will be passing over
  //make the opacity of the satellite change based on whether it will be visible or not
  
