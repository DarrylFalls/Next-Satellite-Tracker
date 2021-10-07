# Next-Satellite-Tracker

## Description:
web application to show when the next satellite will be passing over your location

## Live site:
https://darrylfalls.github.io/Next-Satellite-Tracker/

## Satellite Passes API: 
https://satellites.fly.dev/passes/25544?lat=55.7796&lon=78.6382&limit=1

```
[{
  "rise": {
  "alt": "10.02",
  "az": "216.34",
  "az_octant": "SW",
  "utc_datetime": "2021-10-02 09:41:35.659823+00:00",
  "utc_timestamp": 1633167695,
  "is_sunlit": true,
  "visible": false
},]
```


## Loction IQ API:  https://us1.locationiq.com/v1/search.php?key=[ACCESS KEY]&q=Raleigh&format=json

```
[{
  "place_id": "274525667",
  "lat": "35.7803977",
  "lon": "-78.6390989",
  "display_name": "Raleigh, Wake County, North Carolina, USA",
  "class": "boundary",
  "type": "administrative",
  "importance": 0.7086350442672057,
  "icon": "https://locationiq.org/static/images/mapicons/poi_boundary_administrative.p.20.png"
}]
```

## Wireframe: 
https://www.figma.com/file/p3eGa9XHy7aQYkgO99o4w0/Untitled?node-id=0%3A1


## MVP List:

  //build search bar that will let people search their location using a geocache API

  // create fetch that will use longitude & lattitude from a geocahe API to pull info from the satellite tracking API

  //display that will show the angle the satellite will be in the sky and which compass direction

  //info box that will give all the information aout the satelite to the user

  //organize the page and the info box with flexbox




## Post MVP List:

  //use animation for the satellite display

  //create suggestion dropdown for the search box

  //background of display will change based on time of day the satellite will be passing over

  //skyline will change based on the size of the city

  //use videos as starting backgrounds


## Goals:

  //Day 1: Find and test APIs

  //Day 2: Build basic HTML

  //Day 3: Build initial JS functions

  //Day 4: Add CSS

  //Day 5: Build post-MVP objectives

  //Day 6: Edit JS to improve functoinality

  //Day 7: touch up CSS and clean up code

  //Day 8: Presentation


## Timeframes:

  | Component | Priority | Estimated Time | Actual Time |
| --- | :---: |  :---: | :---: |
| Pseudocode Javascript | H | 2 hr| 1 hrs |
| HTML Structure| H | 2 hrs| 2 hrs |
| Javascript Structure| H | 15 hrs| 12 hrs |
| Add/test API call| H | 3 hrs| 3 hrs |
| Adding clickable buttons and Event Listeners | H | 1 hrs| 1 hrs |
| Incorporating Flexbox | H | 1 hrs| 1 hrs |
| Styling page with CSS | H | 3 hrs| 4 hrs |
| Setting and Styling Media Queries | H | 1 hrs| 1 hrs |
| Styling Images & Videos| H | 2 hrs| 1 hrs |
| Total | - | 30 hrs| 26 hrs |

