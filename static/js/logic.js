// URL endpoint - Global earthquakes for past 30 days above 1 Magnitutde
var endpoint_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_month.geojson"
// Pull data from URL and pass features object to drawCircles() function
d3.json(endpoint_URL, function(data) {
  drawCircles(data.features);
});

// Create function to draw circles based on URL/JSON data
function drawCircles(jsonData) {

  // Create geoJSON object from passed URL/JSON data
  // Note, 3rd coordinate from geoJSON denotes depth
  var earthquakes = L.geoJSON(jsonData, {
    // Pull in coordinates and draw circle based on latitude and longitude with radius based on magnitude
    pointToLayer: function (feature, latlng) {

      // Establish empty color variable
      var circleColor = ""
      // Test depth to get appropriate color
      if (feature.geometry.coordinates.slice(2,3) <= 20) {
        circleColor = "lightgreen";
      } else if (feature.geometry.coordinates.slice(2,3) <= 40) {
        circleColor = "yellowgreen";
      } else if (feature.geometry.coordinates.slice(2,3) <= 60) {
        circleColor = "yellow";
      } else if (feature.geometry.coordinates.slice(2,3) <= 80) {
        circleColor = "orange";
      } else if (feature.geometry.coordinates.slice(2,3) <= 100) {
        circleColor = "orangered";
      } else if (feature.geometry.coordinates.slice(2,3) > 100) {
        circleColor = "red";
      } else {
        circleColor = "white";
      }
      
      // draw circle based on properties
      return L.circle(latlng, {
        stroke: true,
        weight: 1,
        fillOpacity: 0.75,
        color: "black",
        fillColor: circleColor,
        radius: feature.properties.mag * 25000
      })
    },
    // Give each feature a popup describing the location, magnitude, depth, and time of the earthquake
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
    center: [40.4637, -3.7492],
    zoom: 2,
    layers: [satelliteMap, earthquakes]
  });

  // Set up the legend
  var legend = L.control({ position: "bottomleft" });
  legend.onAdd = function() {
    // Create div tag to hold legend
    var div = L.DomUtil.create("div", "info legend");
    // Establish parameters for legend
    var limits = [0,10,30,50,70,90];
    var colors = ["lightgreen","yellowgreen","yellow","orange","orangered","red"];
    var labels = ["0-20 km","21-40 km","41-60 km","61-80 km","81-100 km","100+ km"];
    // Add header to legend
    div.innerHTML = "<h1>Earthquake Depth:</h1>";
    // Loop through limits and draw colored boxes
    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\">" + labels[index] + "</li>");
    });
  
    // Slice labels list to only include the li tag portion
    labels = labels.slice(6,12)
    // Remove commas for clean look
    div.innerHTML += labels.join("");
    return div;
  };

  // Add legend to the map
  legend.addTo(myMap);

  // Create a layer control & add all layers to map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
    }).addTo(myMap);
  
}
