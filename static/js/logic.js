// Creating map object centered on Downtown
var myMap = L.map("map", {
    center: [34.05129606451308, -118.25138691378726],
    zoom: 12
});

// Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(myMap);

var occupiedIcon = L.icon({
    iconUrl: 'static/icons/occupied.svg',
    iconSize: [30, 30], // size of the icon
    iconAnchor: [22, 22], // point of the icon which will correspond to marker's location
    popupAnchor: [-7, -26] // point from which the popup should open relative to the iconAnchor
});
var vacantIcon = L.icon({
    iconUrl: 'static/icons/atmospheric.svg',
    iconSize: [30, 30],
    iconAnchor: [22, 22],
    popupAnchor: [-7, -26]
});

// Grab the data with d3
d3.json('/data', function(response) {

    console.log(response)

    // Create a new marker cluster group
    var markers = L.markerClusterGroup(
        //   spiderfyShapePositions: function(count, centerPt) {
        //     var distanceFromCenter = 35,
        //         markerDistance = 45,
        //         lineLength = markerDistance * (count - 1),
        //         lineStart = centerPt.y - lineLength / 2,
        //         res = [],
        //         i;

        //     res.length = count;

        //     for (i = count - 1; i >= 0; i--) {
        //         res[i] = new Point(centerPt.x + distanceFromCenter, lineStart + markerDistance * i);
        //     }

        //     return res;
        // }
        { disableClusteringAtZoom: 18 }
    );

    // var clicked = function(e) {
    //   console.log(this.lat);
    //   console.log(this.lon);
    //   console.log(e.latlng);
    // }

    // Loop through data
    for (var i = 0; i < response.length; i++) {

        var array = response[i].LatLng.split(','),
            latitude = array[0].trim().replace('(', ""),
            longitude = array[1].trim().replace(')', "");

        var appleURL = `http://maps.apple.com/?q=${latitude},${longitude}`

        var new_marker = L.marker([latitude, longitude], { icon: (response[i].occupancystate == "OCCUPIED" ? occupiedIcon : vacantIcon) })
            .bindPopup(`${response[i].BlockFace} <br> 
                ${response[i].ParkingPolicy} <br> 
                ${response[i].RateRange} <br>
                <a href="${appleURL}" target="_blank">Open in Maps</a>`)

        new_marker.lat = latitude;
        new_marker.lon = longitude;
        // new_marker.on('click', clicked);

        markers.addLayer(new_marker);

    }

    // Zoom to the bounds of a cluster
    markers.on('clusterclick', function(a) {
        a.layer.zoomToBounds({ padding: [20, 20] });
    });

    // Add our marker cluster layer to the map
    myMap.addLayer(markers);

})