# USGS Earthquake - Visualizing Data with Leaflet

### This project plots global earthquakes over the last 30 days. All earthquake data was pulled from the United States Geological Survey Earthquake site. (Depending on current earthquake data, this script may take some time to run so please be patient as it loads.)The default map layer is satelite, but street and darkmap radio options are available as well. 

#### The magnitude of earthquakes is represented by the size of the circle and the depth of earthquakes is representd by the color of the circle (reference the legend for color divisions). Click on any circle to get drill-down data including Magnitude, Depth, Location, and Time.

#### Tectonic plates boundaries are also included from geoJSON files parsed by Hugo Ahlenius (https://github.com/fraxen/tectonicplates) to show where plates connect/overlap. Both the Earthquakes and Tectonic Plates layers can be toggled on and off.


##### There are two ways to run the code, easiest of which is to run index.html directly in Google Chrome or Mozilla Firefox. A dialog will pop up asking for a mapbox API key, which is required to implement the map layers. 

##### index.html includes commented code to pull the API_KEY directly from static/js/config.js (which is removed via .gitignore). In order to run the code via this option, line two in logic.js must be removed/commented and line 31 in index.html must be un-commented and a config.js file must be created in static/js. config.js must include the following code:     API_KEY = "your_api_key_here"

(Note: either method may require implementing a Python server to bypass the HTTP-CORS error, depending on local system setup).