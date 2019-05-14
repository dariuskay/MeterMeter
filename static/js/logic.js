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

var customOptions = {
    'maxWidth': '400',
    'width': '200',
    'className': 'popupCustom'
};

// function chooseMarker(d) {
//     if d.occupancystate === "OCCUPIED" {
//         return L.marker({
//     'maxWidth': '400',
//     'width': '200',
//     'className' : 'popupCustom'
//     }, [latitude, longitude], { icon: occupiedIcon : vacantIcon })
//             .bindPopup(`<b>Address:</b> ${response[i].BlockFace} <br> 
//                 <b>Policy:</b> ${response[i].ParkingPolicy} <br> 
//                 <b>Rate:</b> ${response[i].RateRange} <br>
//                 <a href="${appleURL}" target="_blank"><b>Open in Maps</b></a>`)
//     } else {
//         return L.marker([latitude, longitude], { icon: occupiedIcon : occupiedIcon })
//             .bindPopup(`<b>Address:</b> ${response[i].BlockFace} <br> 
//                 <b>Policy:</b> ${response[i].ParkingPolicy} <br> 
//                 <b>Rate:</b> ${response[i].RateRange} <br>
//                 <a href="${appleURL}" target="_blank"><b>Open in Maps</b></a>`)
//     }
// }

// Grab the data with d3
d3.json('/data', function(response) {

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

        var popupText = `<b>Address:</b> ${response[i].BlockFace} <br> 
                <b>Policy:</b> ${response[i].ParkingPolicy} <br> 
                <b>Rate:</b> ${response[i].RateRange} <br>
                <a href="${appleURL}" target="_blank"><b>Open in Maps</b></a>`;

        var new_marker = L.marker([latitude, longitude], { icon: (response[i].occupancystate == "OCCUPIED" ? occupiedIcon : vacantIcon) });

        if (response[i].occupancystate === "OCCUPIED") {
            new_marker.bindPopup(popupText, customOptions)
        } else {
            new_marker.bindPopup(popupText)
        }

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