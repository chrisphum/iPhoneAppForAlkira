var access_token = "&access_token=pk.eyJ1IjoiY2hyaXNodXkiLCJhIjoiY2twaWlia3ZnMGthcTJwcnJvZXNiYXQ5MCJ9.mDrBVPpUqTqAxwPv9eWvoQ"

export async function Loop(lat, lng, distance) {

        const startLat = lat
        const startLng = lng
        const waypointCount = 2
        distance = parseInt ( (distance * 0.7) / waypointCount )

        var directionLat = Math.random() < 0.5 ? -1 : 1;
        var directionLng = Math.random() < 0.5 ? -1 : 1;

        var waypoints = [{latitude: lat, longitude: lng}]
        for (let i = 0; i < waypointCount; i++) {
            var newWaypoints  = await IsochroneFetch(lat, lng, distance );
            newWaypoints = newWaypoints["features"][0]["geometry"]["coordinates"]

            if (i == waypointCount / 2) {
                directionLat = directionLat * -1
                directionLng = directionLng * -1
            }

            nextWaypoint = WayPointSelector(directionLat, directionLng, lat, lng, newWaypoints)
            lat = nextWaypoint[0]
            lng = nextWaypoint[1]
            waypoints.push({latitude: lat, longitude: lng})
        }

        waypoints.push({latitude: startLat, longitude: startLng})
        var x = await DirectionsFetch(waypoints)
        var polyCoords = []
        x["routes"][0]["geometry"]["coordinates"].forEach(element => polyCoords.push({
            latitude: element[1],
            longitude: element[0]
        }));

        var finalDistance = x["routes"][0]["distance"] // meters
        return await CreateRouteObject(polyCoords, finalDistance, waypoints)
        // return await [polyCoords, finalDistance, waypoints]
}

function CreateRouteObject(polyCoords, finalDistance, waypoints) {

    let maxLat = polyCoords[0].latitude
    let minLat = polyCoords[0].latitude
    let maxLon = polyCoords[0].longitude
    let minLon = polyCoords[0].longitude

    for (let i = 0; i < polyCoords.length; i++) {
      if (polyCoords[i].latitude > maxLat) {
        maxLat = polyCoords[i].latitude
      }
      if (polyCoords[i].latitude < minLat) {
        minLat = polyCoords[i].latitude
      }
      if (polyCoords[i].longitude > maxLon) {
        maxLon = polyCoords[i].longitude
      }
      if (polyCoords[i].longitude < minLon) {
        minLon = polyCoords[i].longitude
      }
    }

    let latdelta = Math.abs(maxLat - minLat) * 1.2
    let londelta = Math.abs(maxLon - minLon) * 1.2
    let centerLat = (maxLat + minLat) / 2
    let centerLon = (maxLon + minLon) / 2

    return {"polyCoords": polyCoords, "finalDistance": finalDistance, "waypoints": waypoints,
                        "latDelta": latdelta, "lonDelta": londelta, "centerLat": centerLat, "centerLon": centerLon}
    
}

function WayPointSelector(directionLat, directionLng, prevLat, prevLng, newWaypoints) {

            result = newWaypoints.filter(filterer);

            function filterer(coord) {
                return (Math.sign(coord[0] - prevLng) == directionLng) && (Math.sign(coord[1] - prevLat) == directionLat)
            }

            // console.log(newWaypoints)
            if (result.length == 0) {
                var randomCoords = newWaypoints.sort(() => Math.random() - 0.5)[0];
            }
            else {
            var randomCoords = result.sort(() => Math.random() - 0.5)[0];
            }

            lng = randomCoords[0]
            lat = randomCoords[1]

            return [lat, lng]
}

async function IsochroneFetch(lat, lng, meters) {

    var profile = "isochrone/v1/mapbox/walking"
    var coordinates = lng + "%2C" + lat
    var contours_meters = "contours_meters=" + meters
    var api = "https://api.mapbox.com/" + profile + "/" + coordinates + "?" + contours_meters + access_token
    // console.log(lat)
            var x = fetch(api)
                    .then(response => {
                        return response.json() 
                    })
                    .then((json) => {
                        // console.log(json)
                        return json
                    })
            return x
}

async function DirectionsFetch(coordsArray) {

    var x = ""
    coordsArray.forEach(element => x = x + (element.longitude + "%2C" + element.latitude + "%3B"));
 
    var profile = "directions/v5/mapbox/walking/"
    var coordinates = x.slice(0, -3)
    var other = "alternatives=false&annotations=distance&continue_straight=true&geometries=geojson&language=en&overview=full&steps=true"
    var api = "https://api.mapbox.com/" + profile + coordinates + "?" + other + access_token

            var y = fetch(api)
                    .then(response => {
                        return response.json() 
                    })
                    .then((json) => {
                        return json
                    })
            return y
}









    // var polygon = [
    //             { latitude: lat+.01, longitude: lng+.01 },
    //             { latitude: lat, longitude: lng }
    //         ]











//     var isResolved = false
    
//     var y = fetch(api)
//         .then(response => {
//             isResolved = true
//             console.log(response.json())
//             return response.json()
            
//         })
//         .then((json) => {
//             isResolved = true
//         });
//     if (isResolved){
//         return y
//     }
//     else {return isResolved}
// }

// var api = "https://api.mapbox.com/directions/v5/mapbox/walking/-73.9871195%2C40.742343%3B-73.9869944%2C40.7449229?alternatives=true&continue_straight=true&geometries=polyline&language=en&overview=simplified&steps=true&access_token=pk.eyJ1IjoiY2hyaXNodXkiLCJhIjoiY2twaWlia3ZnMGthcTJwcnJvZXNiYXQ5MCJ9.mDrBVPpUqTqAxwPv9eWvoQ"

//         fetch(api)
//         .then(response => {
//             return response.json() 
//         })
//         .then((json) => {
//             var polygon = [
//               { latitude: 37.8025259, longitude: -122.4351431 },
//               { latitude: 37.7896386, longitude: -122.421646 },
//               { latitude: 37.7665248, longitude: -122.4161628 },
//               { latitude: 37.7734153, longitude: -122.4577787 },
//               { latitude: 37.7948605, longitude: -122.4596065 }

//             ]
//             setPolyCoords(polygon)
//         });  