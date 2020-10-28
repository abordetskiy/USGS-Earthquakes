# USGS Earthquake - Visualizing Data with Leaflet

## This project plots global earthquakes over the last 30 days. The default map layer is satelite, but street and darkmap radio options are available as well.

### The magnitude of the earthquake is represented by the size of the circle and the depth of the earthquake is representd by the color of the circle (reference the legend for color divisions). Click on any circle to get drill-down data including Magnitude, Depth, Location, and Time.

### Tectonic plates boundaries are also included from geoJSON files parsed by Hugo Ahlenius (https://github.com/fraxen/tectonicplates) to show where plates connect/overlap. Both the Earthquakes and Tectonic Plates layers can be toggled on and off.


#### There are two ways to run the code, easiest of which is to run index.html in Google Chrome or Mozilla Firefox (Note: may require implementing a Python server to bypass the HTTP-CORS error, depending on local system setup).

#### index.html includes commented code to pull the API_KEY directly from static/js/config.js (which is removed via .gitignore). In order to run the code via this option, line two in logic.js must be removed/commented and line 31 in index.html must be un-commented and a config.js file must be created in static/js. config.js must include the following code:     API_KEY = "your_api_key_here"

