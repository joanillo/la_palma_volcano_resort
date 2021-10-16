import 'ol/ol.css';
import GeoJSON from 'ol/format/GeoJSON';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import {fromLonLat} from 'ol/proj';

import Feature from 'ol/Feature';
import {Fill, Stroke, Style} from 'ol/style';

var layers = [];
var casella;

const styles = {
  'Polygon': new Style({
    stroke: new Stroke({
      color: 'black',
      width: 1,
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 255, 0.1)',
    }),
  }),
};

const styles2 = {
  'Polygon': new Style({
    stroke: new Stroke({
      color: 'blue',
      width: 1,
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 255, 0.3)',
    }),
  }),
};

const styleFunction = function (feature) {
  console.log(feature.getProperties().name);
  return styles[feature.getGeometry().getType()];
};

var tileLayer = new TileLayer({
  source: new OSM()
});

// Create a Vector source
var vectorSource = new VectorSource({
  format: new GeoJSON(),
  url: './data/la_palma_newland_211005.json',
});

// Create a Vector layer
var vectorLayer = new VectorLayer({
  source: vectorSource,
  style: styleFunction
});


layers.push(tileLayer);
layers.push(vectorLayer);


const map = new Map({
  target: 'map',
  layers,
  view: new View({
    center: fromLonLat([-17.92546, 28.61140]),
    zoom: 17
  }),
});

map.on("pointermove", function(e) {
  //console.log(e);
  //var coordinate = e.coordinate;
  var features = [];
  map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
    if (feature.getGeometry().getType()=="Polygon") features.push(feature);
    if (features.length > 0) {
      if (casella != features[0].get('name')) {
        casella = features[0].get('name');
        console.log(casella)

        vectorLayer.setStyle(function (feature) {
          if (feature.getProperties().name == features[0].get('name')) {
            return styles2[feature.getGeometry().getType()];
          } else {
            return styles[feature.getGeometry().getType()];
          }
        });

      }
    }
    });
});
