var myMap = L.map("map", {
    center: [
        37.09, -95.71
      ],
      zoom: 3
  });

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
tileSize: 512,
maxZoom: 18,
zoomOffset: -1,
id: "mapbox/dark-v10",
accessToken: API_KEY
}).addTo(myMap);

var query_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson";


d3.json(query_url,function(data){
    console.log(data);
    createFeatures(data.features);
    radiusMag(data.features);
    markerColor(data.features);
});

function radiusMag(magnitude){
    // console.log(magnitude);
    return magnitude * 35000;
        };

function markerColor(magnitude) {
    if (magnitude <= 1) {
        return "green";
    } else if (magnitude <= 2) {
        return "blue";
    } else if (magnitude <= 3) {
        return "yellow";
    } else if (magnitude <= 4) {
        return "orange";
    } else if (magnitude <= 5) {
        return "red";
    } else {
        return "gray";
    };
    };

// var layerGroup = L.layerGroup([circles]);
// var overlayMaps = {"Circles":layerGroup};
// L.control.layers(overlayMaps).addTo(myMap);

function createFeatures(earthquakeData) {
    console.log(earthquakeData);
    function onEachEarthquake(feature, layer) {
        // console.log(radiusMag(feature.properties.mag));
        var circles = L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], 
            {
            color: "blue",
            fillColor: markerColor(feature.properties.mag),
            fillOpacity: 0.75,
            radius: radiusMag(feature.properties.mag),
            }).addTo(myMap);
        
        
        layer.bindPopup("<h3>" + feature.properties.place + ` | Magnitude: ${feature.properties.mag}` +

          "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
          "<hr><p>" + `Coordinates: ${([feature.geometry.coordinates[0], feature.geometry.coordinates[1]])}` + "</p>");
        
        // var layerGroup = L.layerGroup([circles]);
        // var overlayMaps = {"Circles":layerGroup};
        

        };

    

var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachEarthquake
  }).addTo(myMap);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 1, 2, 3, 4, 5];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(myMap);

};

// L.control.layers(overlayMaps).addTo(myMap);

