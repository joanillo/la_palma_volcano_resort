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

import Overlay from 'ol/Overlay';

/**
 * Elements that make up the popup.
 */
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

var vectorSource2;
var features;
var vectorLayer;
var vectorLayerLabels;
var map;

/**
 * Create an overlay to anchor the popup to the map.
 */
var overlay = new Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250,
  },
});

closer.onclick = function () {
  overlay.setPosition(undefined);
  closer.blur();
  return false;
};

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
  //console.log(feature.getProperties().code);
  if (feature.getProperties().id_owner != 1) {
    return stylesOwner[feature.getGeometry().getType()];
  } else {
    return styles[feature.getGeometry().getType()];
  }
};

var tileLayer = new TileLayer({
  source: new OSM()
});

var vectorSource = new VectorSource({
  format: new GeoJSON(),
  url: './data/la_palma_newland_211011.json',
});

// Create a Vector layer
vectorLayer = new VectorLayer({
  source: vectorSource,
  style: styleFunction
});

// Create a Vector layer for abels
vectorLayerLabels = new VectorLayer({
  source: vectorSource,
  style: function (feature) {
    stylesLabel.getText().setText(feature.get('code'));
    return stylesLabel;
  },
});

//les capes que volem pintar
layers.push(tileLayer);
layers.push(vectorLayer);
layers.push(vectorLayerLabels);


map = new Map({
  target: 'map',
  overlays: [overlay],
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
      if (casella != features[0].get('code')) {
        casella = features[0].get('code');
        //console.log(casella)

        vectorLayer.setStyle(function (feature) {
          if (feature.getProperties().code == features[0].get('code')) {
            if (feature.getProperties().id_owner != 1) {
              return stylesHoverOwner[feature.getGeometry().getType()];
            } else {
              return stylesHover[feature.getGeometry().getType()];             
            }
          } else {
            if (feature.getProperties().id_owner != 1) {
              return stylesOwner[feature.getGeometry().getType()];
            } else {
              return styles[feature.getGeometry().getType()];             
            }
          }
        });

        document.getElementById('tooltip').style.visibility="visible";
        var content = document.getElementById('tooltip-content');
        var str_info = '<code>Parcel·la:' + feature.values_.code + '<br />Owner: #' + feature.values_.id_owner + '.' + feature.values_.owner + '<br />Price: ' + feature.values_.price + '€</code>';
        //str_info += 
        content.innerHTML = str_info;
        setTimeout(function(){ tancar_tooltip(); }, 3000); 

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
      console.log(feature.get('code'));
      clicked = true;

      var coordinate = e.coordinate;

      var cont = document.getElementById("popup-content");
      while (cont.firstChild) {
        cont.removeChild(cont.lastChild);
      }

      let cad1 = 'Parcel·la: ' + features[0].getProperties().code;
      let cad2 = 'Propietari: #' + features[0].getProperties().id_owner + "." + features[0].getProperties().owner;
      let cad3 = 'Valor: ' + features[0].getProperties().price + '€';
      let br1 = document.createElement("BR");
      let br2 = document.createElement("BR");
      let br3 = document.createElement("BR");
      let br4 = document.createElement("BR");
      let br5 = document.createElement("BR");
      let br6 = document.createElement("BR");
      let txt_node1 = document.createTextNode(cad1);
      let txt_node2 = document.createTextNode(cad2);
      let txt_node3 = document.createTextNode(cad3);
      let hr1 = document.createElement("HR");

      var code = document.createElement("CODE");

      code.append(txt_node1);
      code.append(br1);
      code.append(txt_node2);
      code.append(br2);
      code.append(txt_node3);
      code.append(hr1);

      cont.append(code);

      let input_id_parcel = document.createElement("INPUT");
      input_id_parcel.setAttribute("type", "hidden");
      input_id_parcel.setAttribute("name", "id_parcel");
      input_id_parcel.setAttribute("value", features[0].getProperties().id_parcel);

      let label_nom = document.createElement("LABEL");
      label_nom.className = "form_label";
      label_nom.setAttribute("value", "Nom: ");
      label_nom.innerText = 'Nom: ';

      let input_nom = document.createElement("INPUT");
      input_nom.setAttribute("type", "text");
      input_nom.setAttribute("name", "name");

      let label_cognoms = document.createElement("LABEL");
      label_cognoms.className = "form_label";
      label_cognoms.setAttribute("value", "Cognoms: ");
      label_cognoms.innerText = "Cognoms: ";

      let input_cognoms = document.createElement("INPUT");
      input_cognoms.setAttribute("type", "text");
      input_cognoms.setAttribute("name", "surname");

      let label_preu = document.createElement("LABEL");
      label_preu.className = "form_label";
      label_preu.setAttribute("value", "Preu: ");
      label_preu.innerText = 'Preu: ';

      let input_preu = document.createElement("INPUT");
      input_preu.setAttribute("type", "text");
      input_preu.setAttribute("name", "price");
      input_preu.setAttribute("value", parseFloat(features[0].getProperties().price)+1000);

      let label_comprar = document.createElement("LABEL");
      label_comprar.className = "form_label";
      label_comprar.setAttribute("value", "");
      label_comprar.innerText = '';

      let input_comprar = document.createElement("INPUT");
      input_comprar.setAttribute("type", "button");
      input_comprar.setAttribute("name", "comprar");
      input_comprar.setAttribute("value", "Comprar");
      input_comprar.addEventListener('click', function() { comprar(input_id_parcel.value, input_nom.value, input_cognoms.value, input_preu.value)}, false);

      let par_resultat = document.createElement("P");
      par_resultat.setAttribute("id", "resultat_compra");

      code.append(input_id_parcel);
      code.append(label_nom);
      code.append(input_nom);
      code.append(br3);
      code.append(label_cognoms);
      code.append(input_cognoms);
      code.append(br4);
      code.append(label_preu);
      code.append(input_preu);
      code.append(br5);
      code.append(br6);
      code.append(label_comprar);
      code.append(input_comprar);
      code.append(par_resultat);

      overlay.setPosition(coordinate);

      vectorLayer.setStyle(function (feature) {
          if (feature.getProperties().code == features[0].get('code')) {
            if (features[0].getProperties().id_owner != 1) {
              return stylesHoverOwner[features[0].getGeometry().getType() + '2'];
            } else {
              return stylesHover[features[0].getGeometry().getType() + '2'];             
            }
          } else {
            if (feature.getProperties().id_owner != 1) {
              return stylesOwner[feature.getGeometry().getType()];
            } else {
              return styles[feature.getGeometry().getType()];             
            }
          }
      });


    }
  });
});


function tancar_tooltip() {
  document.getElementById('tooltip').style.visibility = "hidden";
}

function comprar(id_parcel, nom, cognoms, preu) {
  var resultat_compra = document.getElementById('resultat_compra');
  resultat_compra.innerHTML = "<hr />Compra realitzada";

  var xmlhttp;
  xmlhttp=new XMLHttpRequest();
  xmlhttp.onreadystatechange=function() {

    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
      resultat_compra.innerHTML = "<hr />" + xmlhttp.responseText;
    } else {
      resultat_compra.innerHTML = "<img src=\"img/ajax_wait.gif\" />";
    }
  }

  xmlhttp.open("POST","http://localhost/LPVR/php/compra.php", true)
  xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xmlhttp.send("id_parcel=" + id_parcel + "&nom=" + nom + "&cognoms=" + cognoms + "&preu=" + preu);

}
