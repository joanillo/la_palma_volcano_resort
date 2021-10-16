/*
cd /home/joan/projectes/OSM/la_palma/nodejs/
PS1="$ "
node parcellacio_v1.js
*/


const fs = require('fs')
/*
fs.readFile('overpass_211004.json', 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  //console.log(data)
})
*/

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

