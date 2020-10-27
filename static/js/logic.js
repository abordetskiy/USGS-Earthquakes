// URL endpoint
var endpoint_URL = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

// Pull data from URL and pass features object to drawCircles() function
d3.json(endpoint_URL, function(data) {
  drawCircles(data.features);
});

// Create function to draw circles based on URL/JSON data
function drawCircles(jsonData) {

// Create geoJSON object from passed URL/JSON data
  var earthquakes = L.geoJSON(jsonData, {
    // Pull in coordinates and draw circle based on latitude and longitude with radius based on magnitude
    pointToLayer: function (feature, latlng) {
      return L.circle(latlng, {
        stroke: true,
        weight: 1,
        fillOpacity: 0.75,
        color: "black",

        fillColor: "orange",
        radius: feature.properties.mag * 25000
      })
    },
    // Give each feature a popup describing the location, magnitude, depth, and time of the earthquake
    // Note, 3rd coordinate from geoJSON denotes depth
    onEachFeature: function (feature, layer) {
      layer.bindPopup(
        "<h3>" + "Magnitude: " + feature.properties.mag + "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp Depth: " + feature.geometry.coordinates.slice(2,3) + " km" + "</h3><hr>" + 
        "<p>" + "Location: " + feature.properties.place + "</p>" +
        "<p>" + new Date(feature.properties.time) + "</p>" 
      );
    }
  })
  // Pass earthquake layer to drawMaps() function once built
  drawMaps(earthquakes)
}

// Create function to pull in and draw all maps based on earthquake layer
function drawMaps(earthquakes) {

  // Define satellite layer
  var satelliteMap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  // Define street layer
  var streetMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  // Define dark layer
  var darkMap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold all map layers
  var baseMaps = {
    "Satellite Map": satelliteMap,
    "Street Map": streetMap,
    "Dark Map": darkMap
  };

  // Create overlay object & pass in earthquake layer
  var overlayMaps = {
    "Earthquakes": earthquakes
  };

  // Establish Map variable in 'map' tag in index.html & set default layers
  var myMap = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 4,
    layers: [satelliteMap, earthquakes]
  });

    // Create a layer control & add all layers to map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
}