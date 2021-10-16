import 'ol/ol.css';
import GeoJSON from 'ol/format/GeoJSON';
import {Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import {fromLonLat} from 'ol/proj';

import Feature from 'ol/Feature';
import {Fill, Stroke, Style, Text} from 'ol/style';

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
  'Polygon2': new Style({
    stroke: new Stroke({
      color: 'black',
      width: 3,
    }),
    fill: new Fill({
      color: 'rgba(0, 255, 0, 1)',
    }),
  }),
};

const stylesOwner = {
  'Polygon': new Style({
    stroke: new Stroke({
      color: 'black',
      width: 1,
    }),
    fill: new Fill({
      color: 'rgba(255, 0, 0, 0.5)',
    }),
  }),
  'Polygon2': new Style({
    stroke: new Stroke({
      color: 'black',
      width: 3,
    }),
    fill: new Fill({
      color: 'rgba(0, 255, 0, 1)',
    }),
  }),
};

const stylesHover = {
  'Polygon': new Style({
    stroke: new Stroke({
      color: 'black',
      width: 3,
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 255, 0.8)',
    }),
  }),
  'Polygon2': new Style({
    stroke: new Stroke({
      color: 'black',
      width: 3,
    }),
    fill: new Fill({
      color: 'rgba(0, 255, 0, 1)',
    }),
  }),
};

const stylesHoverOwner = {
  'Polygon': new Style({
    stroke: new Stroke({
      color: 'black',
      width: 3,
    }),
    fill: new Fill({
      color: 'rgba(255, 0, 0, 1)',
    }),
  }),
  'Polygon2': new Style({
    stroke: new Stroke({
      color: 'black',
      width: 3,
    }),
    fill: new Fill({
      color: 'rgba(0, 255, 0, 1)',
    }),
  }),
};


const stylesLabel = new Style({
  fill: new Fill({
    color: 'rgba(255, 255, 255, 0.6)',
  }),
  stroke: new Stroke({
    color: '#319FD3',
    width: 1,
  }),
  text: new Text({
    font: '18px Calibri,sans-serif',
    fill: new Fill({
      color: '#000',
    }),
    stroke: new Stroke({
      color: '#fff',
      width: 3,
    }),
  }),
});

const styleFunction = function (feature) {
  //console.log(feature.getProperties().name);
  if (feature.getProperties().has_owner) {
    return stylesOwner[feature.getGeometry().getType()];
  } else {
    return styles[feature.getGeometry().getType()];
  }
};


var tileLayer = new TileLayer({
  source: new OSM()
});

// Create a Vector source
var vectorSource = new VectorSource({
  format: new GeoJSON(),
  url: './data/la_palma_newland_211005b.json',
});

// Create a Vector layer
var vectorLayer = new VectorLayer({
  source: vectorSource,
  style: styleFunction
});

// Create a Vector layer for abels
var vectorLayerLabels = new VectorLayer({
  source: vectorSource,
  style: function (feature) {
    stylesLabel.getText().setText(feature.get('name'));
    return stylesLabel;
  },
});

//les capes que volem pintar
layers.push(tileLayer);
layers.push(vectorLayer);
layers.push(vectorLayerLabels);

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
        //console.log(casella)

        vectorLayer.setStyle(function (feature) {
          if (feature.getProperties().name == features[0].get('name')) {
            if (feature.getProperties().has_owner) {
              return stylesHoverOwner[feature.getGeometry().getType()];
            } else {
              return stylesHover[feature.getGeometry().getType()];             
            }
          } else {
            if (feature.getProperties().has_owner) {
              return stylesOwner[feature.getGeometry().getType()];
            } else {
              return styles[feature.getGeometry().getType()];             
            }
          }
        });

      }
    }
    });
});

map.on("click", function(e) {
  //console.log(e);
  let clicked = false;
  var features = []; //nou
  map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {
    //console.log(layer) //ara tinc dos layers, doncs els labels també els he carregat com a polígons
    if (feature.getGeometry().getType()=="Polygon" && clicked==false) {
      features.push(feature); //nou
      console.log(feature.get('name'));
      clicked = true;

      vectorLayer.setStyle(function (feature) {
          if (feature.getProperties().name == features[0].get('name')) {
            if (features[0].getProperties().has_owner) {
              return stylesHoverOwner[features[0].getGeometry().getType() + '2'];
            } else {
              return stylesHover[features[0].getGeometry().getType() + '2'];             
            }
          } else {
            if (feature.getProperties().has_owner) {
              return stylesOwner[feature.getGeometry().getType()];
            } else {
              return styles[feature.getGeometry().getType()];             
            }
          }
      });

    }
  });
});