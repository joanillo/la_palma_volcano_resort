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

import INFO from './INFO.js';
import FAQ from './FAQ.js';
import SQL from './SQL.js';
import VIDEO from './VIDEO.js';

// === ROUTER BÀSIC ====================
//https://jstutorial.medium.com/making-your-own-vanilla-js-router-2e621ffdee88
function load_content(id) {
  //console.log('Content loading for /' + id + '...');
  document.title = id + ' - La Palma Volcano Resort';
  if (id=='HOME') {
    window.history.pushState({id}, `${id}`, `/`);
  } else {
    window.history.pushState({id}, `${id}`, `/${id}`);
  }
  //falta: how to remove hash from url

  var info = document.getElementById('info');
  var txt = "";

  switch (id) {
    case 'HOME':
      info.innerHTML = "";
      info.style.visibility = "hidden";
      break;
    case 'INFO':
      info.innerHTML = INFO();
      info.style.visibility = "visible";
      break;
    case 'FAQ':
      info.innerHTML = FAQ();
      info.style.visibility = "visible";
      break;
    case 'SQL':
      info.innerHTML = SQL();
      info.style.visibility = "visible";
      break;
    case 'VIDEO':
      info.innerHTML = VIDEO();
      info.style.visibility = "visible";
      break;
  }
}

window.onload = function(){
  document.getElementById('HOME').addEventListener("click", function() {load_content('HOME')}, false);
  document.getElementById('INFO').addEventListener("click", function() {load_content('INFO')}, false);
  document.getElementById('FAQ').addEventListener("click", function() {load_content('FAQ')}, false);
  document.getElementById('SQL').addEventListener("click", function() {load_content('SQL')}, false);
  document.getElementById('VIDEO').addEventListener("click", function() {load_content('VIDEO')}, false);
};
// === FI ROUTER =====================

/**
 * Elements that make up the popup.
 */
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

var vectorSource;
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

//les capes que volem pintar
layers.push(tileLayer);

map = new Map({
  target: 'map',
  overlays: [overlay],
  layers,
  view: new View({
    center: fromLonLat([-17.92546, 28.61140]),
    zoom: 17
  }),
});

//ens connectem a la bd per omplir les dades JSON, i així podem pintar les capes que falten
create_layers_from_db();


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
        var str_info = '<code>Parcel·la:' + feature.values_.code + '<br />Owner: #' + feature.values_.id_owner + '.' + feature.values_.owner + '<br />Price: ' + convertir_num_a_locale(feature.values_.price) + '€</code>';
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
      //input_nom.addEventListener('change', function() { validacio_nom(input_nom)}, false);

      let label_cognoms = document.createElement("LABEL");
      label_cognoms.className = "form_label";
      label_cognoms.setAttribute("value", "Cognoms: ");
      label_cognoms.innerText = "Cognoms: ";

      let input_cognoms = document.createElement("INPUT");
      input_cognoms.setAttribute("type", "text");
      input_cognoms.setAttribute("name", "surname");
      input_cognoms.addEventListener('change', function() { validacio_cognoms(input_cognoms, label_error)}, false);

      let label_preu = document.createElement("LABEL");
      label_preu.className = "form_label";
      label_preu.setAttribute("value", "Preu: ");
      label_preu.innerText = 'Preu: ';

      let input_preu = document.createElement("INPUT");
      input_preu.setAttribute("type", "text");
      input_preu.setAttribute("name", "price");
      input_preu.setAttribute("value", convertir_num_a_locale(parseFloat(features[0].getProperties().price)+1000));
      input_preu.addEventListener('change', function() { validacio_preu(input_preu, features[0].getProperties().price, label_error)}, false);

      let label_error = document.createElement("LABEL");
      label_error.className = "form_label";
      label_error.setAttribute("value", "");
      label_error.style.display = 'none';

      let label_comprar = document.createElement("LABEL");
      label_comprar.className = "form_label";
      label_comprar.setAttribute("value", "");
      label_comprar.innerText = '';

      let input_comprar = document.createElement("INPUT");
      input_comprar.setAttribute("type", "button");
      input_comprar.setAttribute("name", "comprar");
      input_comprar.setAttribute("value", "Comprar");
      input_comprar.addEventListener('click', function() {
        var resultat = true;
        //resultat = validacio_nom(input_nom);
        resultat = resultat && validacio_cognoms(input_cognoms, label_error);
        resultat = resultat && validacio_nom_complet(input_nom, input_cognoms, label_error);
        resultat = resultat && validacio_preu(input_preu, features[0].getProperties().price, label_error);
        //console.log(resultat);
        if (resultat) {
          input_comprar.disabled = true;
          comprar(input_id_parcel.value, input_nom.value, input_cognoms.value, convertir_locale_a_num(input_preu.value))
        }
      }, false);

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
      code.append(label_error);
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


function create_layers_from_db() {
  var xmlhttp;
  xmlhttp=new XMLHttpRequest();
  xmlhttp.onreadystatechange=function() {

    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
      //console.log(xmlhttp.responseText);
      var obj = JSON.parse(xmlhttp.responseText);

      //hem de construir aquesta cadena
      //var json_obj = '{"type":"FeatureCollection","features":[{"type":"Feature","code":"R-Q","properties":{"id_parcel":"84", "code":"R-Q", "id_owner":1, "owner":"admin", "price":30000.00},"geometry":{"type":"Polygon","coordinates":[['+coord1+','+coord2+','+coord3+','+coord4+']]}}]}';
      var json_obj = `{"type":"FeatureCollection","features":[`;

      for (let i=0;i<obj.features.length;i++) {
        if (i!=0) json_obj += ',';
        let lat1 = parseFloat(obj.features[i].lat);
        let lon1 = parseFloat(obj.features[i].lon);
        let lat2 = lat1;
        let lon2 = (lon1 + 0.0005).toFixed(4);
        let lat3 = (lat1 - 0.0005).toFixed(4);
        let lon3 = lon2;
        let lat4 = lat3;
        let lon4 = lon1;

        var coord1 = '['+fromLonLat([lon1, lat1]).toString()+']';
        var coord2 = '['+fromLonLat([lon2, lat2]).toString()+']';
        var coord3 = '['+fromLonLat([lon3, lat3]).toString()+']';
        var coord4 = '['+fromLonLat([lon4, lat4]).toString()+']';
        //console.log(obj.features[i].code);
        var nom_complet;
        if (obj.features[i].name=='' && obj.features[i].surname=='admin') {
          nom_complet = 'admin';
        } else {
          nom_complet = obj.features[i].name + ' ' + obj.features[i].surname;
        }
  
        json_obj += `{"type":"Feature","code":"${obj.features[i].code}","properties":{"id_parcel":"${obj.features[i].id_parcel}", "code":"${obj.features[i].code}", "id_owner":${obj.features[i].id_owner}, "owner":"${nom_complet}", "price":${obj.features[i].price}},"geometry":{"type":"Polygon","coordinates":[[${coord1},${coord2},${coord3},${coord4}]]}}`;

      } 
      
      json_obj += `]}`;

      vectorSource = new VectorSource({
          format: new GeoJSON(),
      });

      features = vectorSource.getFormat().readFeatures(json_obj);
      vectorSource.addFeatures(features);

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

      //les capes que hem creat amb la info que ve de la bd
      layers.push(vectorLayer);
      layers.push(vectorLayerLabels);
      //he de tornar a renderitzar el mapa
      map.addLayer(layers[1]);
      map.addLayer(layers[2]);
    }
  }

  xmlhttp.open("GET","http://localhost/LPVR/php/fill_json_from_db.php", true)
  xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xmlhttp.send();
}

function comprar(id_parcel, nom, cognoms, preu) {
  console.log(preu);
  var resultat_compra = document.getElementById('resultat_compra');
  resultat_compra.innerHTML = "<hr />Compra realitzada";

  var xmlhttp;
  xmlhttp=new XMLHttpRequest();
  xmlhttp.onreadystatechange=function() {

    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
      resultat_compra.innerHTML = "<hr />" + xmlhttp.responseText;
      map.removeLayer(layers[2]); //eliminem del mapa les dues capes de parcel·lació
      map.removeLayer(layers[1]);
      layers.pop(); //eliminem els dos layers de parcel·lació
      layers.pop();
      create_layers_from_db(); //afegim els dos layers i les dues capes del mapa, amb la informació renovada
    } else {
      resultat_compra.innerHTML = "<img src=\"img/ajax_wait.gif\" />";
    }
  }

  xmlhttp.open("POST","http://localhost/LPVR/php/compra.php", true)
  xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xmlhttp.send("id_parcel=" + id_parcel + "&nom=" + nom + "&cognoms=" + cognoms + "&preu=" + preu);
}


function validacio_cognoms(ele, ele_error) {
  if (ele.value.length==0 || ele.value.length>50 || ele.value==' ') {
    //console.log('Cognoms és obligatori');
    ele_error.innerText = 'cognom és obligatori';
    ele_error.style.display = 'inline';
    return false;
  } else {
    return true;
  }
}

function validacio_nom_complet(ele_nom, ele_cognoms, ele_error) {
  if (ele_cognoms.value.length==0 || ele_cognoms.value.length>50 || ele_cognoms.value==' ') {
    //console.log('Cognoms és obligatori');
    ele_error.innerText = 'cognom és obligatori';
    ele_error.style.display = 'inline';
    return false;
  } else if (ele_cognoms.value != 'admin' && ele_nom.value == '') {
    //console.log('nom és obligatori');
    ele_error.innerText = 'nom és obligatori';
    ele_error.style.display = 'inline';
    return false;
  } else {
    return true;
  }
}

function validacio_preu(ele, valor_preu, ele_error) {
  if (convertir_locale_a_num(ele.value) < (valor_preu+1000) || convertir_locale_a_num(ele.value) > (valor_preu+9000)) {
    //console.log('Preu ha d\'estar entre ' + (valor_preu+1000) + ' i ' + (valor_preu+9000))
    ele_error.innerText = 'Preu ha d\'estar entre ' + convertir_num_a_locale(valor_preu+1000) + ' i ' + convertir_num_a_locale(valor_preu+9000);
    ele_error.style.display = 'inline';
    return false;
  } else {
    return true;
  }
}

function convertir_num_a_locale(num) {
  return num.toLocaleString('es-ES');
}

function convertir_locale_a_num(strnum) {
  let num = strnum.replace(/\./,'');
  let num2 = num.replace(",", ".");
  return parseFloat(num2);
}