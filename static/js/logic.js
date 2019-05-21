// Creating map object centered on Downtown
var myMap = L.map("map", {
    center: [34.05129606451308, -118.35138691378726],
    zoom: 12
});

// Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 20,
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

var layers = {
  Vacant: new L.LayerGroup(),
  Occupied: new L.LayerGroup()
};

var overlays = {
    'Unpaid Meters': layers.Vacant,
    'Occupied Meters': layers.Occupied
}

function categorize(integer){
    if (integer > 100) {
        return "large"
    } else if (integer > 15) {
        return "medium"
    } else {
        return "small"
    }
}



// Create a control for our layers, add our overlay layers to it
L.control.layers(null, overlays).addTo(myMap);

// Create a legend to display information about our map
var info = L.control({
  position: "bottomright"
});


d3.json('/data', function(response) {

    // Create a new marker cluster group
    var markers = L.markerClusterGroup({
            iconCreateFunction: function (cluster) {
                var markers = cluster.getAllChildMarkers();
                return L.divIcon({ html: markers.length, className: `occupied${categorize(markers.length)}`, iconSize: L.point(30, 30) });
            },
            disableClusteringAtZoom: 18
        });
    var vacantmarkers = L.markerClusterGroup({
            iconCreateFunction: function (cluster) {
                var markers = cluster.getAllChildMarkers();
                return L.divIcon({ html: markers.length, className: `vacant${categorize(markers.length)}`, iconSize: L.point(30, 30) });
            },
            disableClusteringAtZoom: 18
        });

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
            markers.addLayer(new_marker);

            // new_marker.addTo(layers['Occupied'])
            new_marker.bindPopup(popupText, customOptions)
        } else {
            vacantmarkers.addLayer(new_marker)
            // new_marker.addTo(layers['Vacant'])
            new_marker.bindPopup(popupText)
        }

        new_marker.lat = latitude;
        new_marker.lon = longitude;
    }

    markers.addTo(layers['Occupied']);
    vacantmarkers.addTo(layers['Vacant']);

    // Zoom to the bounds of a cluster
    markers.on('clusterclick', function(a) {
        a.layer.zoomToBounds({ padding: [20, 20] });
    });

    // Add our marker cluster layer to the map
    myMap.addLayer(vacantmarkers);
    myMap.addLayer(markers);

})

var home = d3.select('clickme navbar-brand');

var downtown = document.getElementById('dt');
var hollywood = document.getElementById('hw');
var westwood = document.getElementById('ww');
var venice = document.getElementById('vb');

downtown.addEventListener('click', function(event) {
    myMap.flyTo([34.05129606451308, -118.25138691378726], 15)
});

hollywood.addEventListener('click', function(event) {

    myMap.flyTo([34.099, -118.336], 16)
});

westwood.addEventListener('click', function(event) {

    myMap.flyTo([34.061541, -118.440521],
        16)
});
venice.addEventListener('click', function(event) {

    myMap.flyTo([33.986778, -118.472992], 17)
});
home.on('click', function(event) {
    console.log("Click");
    myMap.flyTo([34.05129606451308, -118.35138691378726], 12)
});