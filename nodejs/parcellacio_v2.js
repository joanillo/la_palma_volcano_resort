/*
cd /home/joan/projectes/OSM/la_palma/nodejs/
PS1="$ "
node parcellacio_v2.js
*/


const fs = require('fs')
/*

// FASE 1: detectem els punts nord i surt de la costa on comença l'aflorament. Omplim un array de punts de la costa
console.log("FASE 1");
var data=fs.readFileSync('./overpass_211004.json', 'utf8');
var words=JSON.parse(data);
//console.log(words.elements.length);
//var lat_start, lat_end, lon_start, lon_end;
var lat_north_prov = 28.61442, lon_north_prov = -17.92517, lat_south_prov = 28.60865, lon_south_prov = -17.92326;
var lat_north, lon_north, lat_south, lon_south;
//var ind_north, ind_south;
var node_north, node_south;

var dist_north = 10000;
var dist_south = 10000;

var arr_coast_points = []
var arr_coast_nodes = []

for (let i=0;i<words.elements.length;i++) {
	if (words.elements[i].type == "way") {
		arr_nodes = words.elements[i].nodes;
	}
}

for (let i=0;i<arr_nodes.length;i++) {
	arr_coast_nodes.push(arr_nodes[i]);
}
console.log(arr_coast_nodes.length);

for (let i=0;i<words.elements.length;i++) {
	if (words.elements[i].type == "node") {
		let node = words.elements[i].id;
		let lat = words.elements[i].lat;
		let lon = words.elements[i].lon;
		let dist2_north = (Math.abs(lat_north_prov) - Math.abs(lat))**2 + (Math.abs(lon_north_prov) - Math.abs(lon))**2
		let dist2_south = (Math.abs(lat_south_prov) - Math.abs(lat))**2 + (Math.abs(lon_south_prov) - Math.abs(lon))**2
		//console.log(dist2)
		if (dist2_north < dist_north) {
			dist_north = dist2_north;
			node_north = node;
			lat_north = lat;
			lon_north = lon;
		}
		if (dist2_south < dist_south) {
			dist_south = dist2_south;
			node_south = node;
			lat_south = lat;
			lon_south = lon;
		}
		var arr = [];
		arr.push(node);
		arr.push(lat);
		arr.push(lon);
		arr_coast_points.push(arr);
	}
}

console.log(lat_north);
console.log(lon_north);
console.log(lat_south);
console.log(lon_south);

console.log(node_north);
console.log(node_south);


// FASE 2: ara que ja sabem quins són aquests punts i nodes, anem a eliminar de l'array de nodes els nodes que estan per dalt o per baix (en la via del coastline, els nodes estan ordenats. En canvi, la manera com surten els nodes objecte no tenen per què estar ordenats).
console.log("FASE 2");
var comptador_north = 0;
var comptador_south = 0;

console.log();

for (let i = 0; i < arr_coast_nodes.length;i++) {
	//if (arr_coast_nodes.includes(node_north)) console.log('true');
	if (arr_coast_nodes[i] == node_north) comptador_north = i;
	if (arr_coast_nodes[i] == node_south) comptador_south = i;
}

var removed = arr_coast_nodes.splice(0,comptador_north);
var removed = arr_coast_nodes.splice(comptador_south-comptador_north+1);
//arr_coast_nodes conté només els elements de la coastline que han aflorat
console.log("La nova costa té: " + arr_coast_nodes.length + " nodes");

//ara he de fer un array de nodes [lat,lon] que estigui ordenat segons tinc ordenat l'array de nodes
console.log(arr_coast_nodes[0]);
console.log(arr_coast_points.length);

var arr_coast_points_final = [];
//per cada node recorro arr_coast_points fins que el trobo, i aleshores l'afegeixo a l'array final, que estarà ordenat i tindré les dades geogràfiques
for (let i=0;i<arr_coast_nodes.length;i++) {
	for (let j=0;j<arr_coast_points.length;j++) {
		if (arr_coast_nodes[i] == arr_coast_points[j][0]) {
			arr_coast_points_final.push(arr_coast_points[j]);
			arr_coast_points.splice(j,1);
			break;
		}
	}
}

console.log(arr_coast_points_final.length);
console.log(arr_coast_points_final[0]);
console.log(arr_coast_points_final[arr_coast_points_final.length-1]);
//ja tenim un array de coordenades ordenat, i que ressegueix tota la línia de la costa nova: arr_coast_points_final

// FASE 3: Decideixo un requadre general (i suficientment gros) que parcel·larem. Seré generós i inclouré zones de mar.
// de moment agafem 4 decimals per lat i lon, i que la diferència sigui múltiple de 5.
console.log("FASE 3");
*/
//multipoligon:
//aquest és un bon enllaç per trobar les coordenades (però s'ha de modificar una mica per tenir els 4 decimals)
//https://openlayers.org/en/latest/examples/geographic.html
//aquest és el marc general on vull agafar la superfície. TODO: redefinir-lo
//const surface = [[-17.9318,28.6133],[-17.9233,28.6133],[-17.9233,28.6073],[-17.9318,28.6073]];
//const surface = [[-17.9282,28.6140],[-17.9197,28.6140],[-17.9197,28.6080],[-17.9282,28.6080]];
//const surface = [[-17.9312,28.6140],[-17.9227,28.6140],[-17.9227,28.6080],[-17.9312,28.6080]];
const surface = [[-17.9332,28.6170],[-17.9227,28.6170],[-17.9227,28.6060],[-17.9332,28.6060]];

const num_files = ((surface[0][1]-surface[2][1])*2000).toFixed(0); //resolució de 0.0005; 0.0060/12=0.0005; 1/0.0005=2000
const num_columnes = ((surface[1][0]-surface[0][0])*2000).toFixed(0); //85/5 = 17
console.log(num_files); //12 files
console.log(num_columnes); //17 columnes
const pash = 0.0005;
const pasv = 0.0005;
console.log(pash);
console.log(pasv);

//coordenades de la 1a casella (dalt esquerre)
const surface2 = [surface[0],[surface[0][0]+0.0005,surface[0][1]],[surface[0][0]+0.0005,surface[0][1]-0.0005],[surface[0][0],surface[0][1]-0.0005]];

//i ara hem de fer un array num_files*num_columnes de multipolígons que seran cadascuna de les caselles
var arr_tesselles_fila = [];
var arr_tesselles = [];
//files
for (let i=0;i<num_files;i++) {
//for (let i=0;i<2;i++) {
	arr_tesselles_fila = [];
	//columnes
	for (let j=0;j<num_columnes;j++) {
	//for (let j=0;j<3;j++) {
		let multipoligon = [];
		let point1 = [(surface2[0][0]+pash*j).toFixed(4),(surface2[0][1]-pasv*i).toFixed(4)];
		let point2 = [(surface2[1][0]+pash*j).toFixed(4),(surface2[1][1]-pasv*i).toFixed(4)];
		let point3 = [(surface2[2][0]+pash*j).toFixed(4),(surface2[2][1]-pasv*i).toFixed(4)];
		let point4 = [(surface2[3][0]+pash*j).toFixed(4),(surface2[3][1]-pasv*i).toFixed(4)];
		multipoligon.push(point1);
		multipoligon.push(point2);
		multipoligon.push(point3);
		multipoligon.push(point4);
		arr_tesselles_fila.push(multipoligon);	
	}
	arr_tesselles.push(arr_tesselles_fila);
	
}

//console.log(arr_tesselles_fila.length);
console.log(arr_tesselles.length);
console.log(arr_tesselles[0].length);

// FASE 4: generem el fitxer geojson (de moment totes les cel·les, encara no mirem la info geogràfica)
const codis = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
var stream = fs.createWriteStream("la_palma_newland_211005.json");
stream.once('open', function(fd) {
	let cad = "";
	cad = cad + "{\"type\":\"FeatureCollection\",\"features\":[\n";
	for (let i=0;i<num_files;i++) {
	//for (let i=0;i<4;i++) {
		//columnes
		for (let j=0;j<num_columnes;j++) {
		//for (let j=0;j<4;j++) {
			cad = cad + "{\"type\":\"Feature\",\"id\":\"" + codis[i] +"-"+ codis[j] + "\",\"properties\":{\"name\":\"" + codis[i] + "-" + codis[j] + "\"},\"geometry\":{\"type\":\"Polygon\",\"coordinates\":";
			cad = cad + "[[";
			cad = cad + "[" + arr_tesselles[i][j][0] + "],[" + arr_tesselles[i][j][1] + "],[" + arr_tesselles[i][j][2] + "],[" + arr_tesselles[i][j][3] + "]";
			cad = cad + "]]";
			cad = cad + "}}";
			if (i!=num_files-1 || j!=num_columnes-1) cad = cad + ",";
			cad = cad + "\n";
		}
	}
	cad = cad + "]}";
	console.log(cad);
	stream.end();
});
