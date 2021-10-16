/*
npm install mysql2

cd /home/joan/projectes/OSM/la_palma/nodejs/
PS1="$ "
node parcellacio_v5.js
*/


const fs = require('fs')
var mysql = require('mysql2');
/*
// FASE 1: detectem els punts nord i surt de la costa on comença l'aflorament. Omplim un array de punts de la costa
console.log("FASE 1");
var data=fs.readFileSync('./overpass_211009.json', 'utf8');
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
//però aquest array de coordenades ordenat no és un multipoligon. Ara faré el multipoligon:
var multipolygon_coast = [];
for (let i=0;i<arr_coast_points_final.length;i++) {
	let arr = [];
	arr.push(arr_coast_points_final[i][2]);
	arr.push(arr_coast_points_final[i][1]);
	multipolygon_coast.push(arr);
}

// FASE 3 Decideixo un requadre general (i suficientment gros) que parcel·larem. Seré generós i inclouré zones de mar.
// de moment agafem 4 decimals per lat i lon, i que la diferència sigui múltiple de 5.
console.log("FASE 3");

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
const pash = 0.0005; //si el pas és de 0.0005, això són 50mx50m = 2500m^2 = 1/4 Ha
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
		let multipolygon = [];
		let point1 = [(surface2[0][0]+pash*j).toFixed(4),(surface2[0][1]-pasv*i).toFixed(4)];
		let point2 = [(surface2[1][0]+pash*j).toFixed(4),(surface2[1][1]-pasv*i).toFixed(4)];
		let point3 = [(surface2[2][0]+pash*j).toFixed(4),(surface2[2][1]-pasv*i).toFixed(4)];
		let point4 = [(surface2[3][0]+pash*j).toFixed(4),(surface2[3][1]-pasv*i).toFixed(4)];
		multipolygon.push(point1);
		multipolygon.push(point2);
		multipolygon.push(point3);
		multipolygon.push(point4);
		arr_tesselles_fila.push(multipolygon);	
	}
	arr_tesselles.push(arr_tesselles_fila);
	
}

//console.log(arr_tesselles_fila.length);
console.log(arr_tesselles.length);
console.log(arr_tesselles[0].length);

// FASE 4: omplim la informació a la base de dades. Es respecten les parcel·les que ja estan creades
// és a dir, el delta de lava va creixent, i es poden incorporar noves parcel·les a la base de dades
console.log('---------------------');
const codis = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

var conn = require("./connection.js");
var max_id_parcel;
var max_id_transaction;
var arr_parcel_codes = [];

//hi haurà parcel·les que ja existeixen a la bd, i d'altres que són antigues. L'objectiu és inserir les noves, i conservar la informació de les antigues
// les parcel·les noves tenen com a propietari el id_owner = 1
//primer de tot he de trobar les parcel·les actuals, i posar el seu id en un array.

//https://devdotcode.com/interact-with-mysql-database-using-async-await-promises-in-node-js/
var queryPromise1 = () =>{
    return new Promise((resolve, reject)=>{
        conn.query('SELECT max(id_parcel) as max_id_parcel FROM PARCEL',  (error, results)=>{
            if(error){
                return reject(error);
            }
            return resolve(results);
        });
    });
};

var queryPromise2 = () =>{
    return new Promise((resolve, reject)=>{
        conn.query('SELECT * FROM PARCEL',  (error, results)=>{
            if(error){
                return reject(error);
            }
            return resolve(results);
        });
    });
};

var queryPromise3 = () =>{
    return new Promise((resolve, reject)=>{
        conn.query('SELECT max(id_transaction) as max_id_transaction FROM TRANSACTION',  (error, results)=>{
            if(error){
                return reject(error);
            }
            return resolve(results);
        });
    });
};

var queryInsert = (cad_sql) =>{
    return new Promise((resolve, reject)=>{
    	//console.log(cad_sql);
		try {
	        conn.query(cad_sql,  (error, results)=>{
	            return resolve(results);
	        });
		} catch(error){
			console.log(error)
			return reject(error);
		}

	    });
};

async function sequentialQueries () {
 
	try{
		const result1 = await queryPromise1();
		const result2 = await queryPromise2();
		const result3 = await queryPromise3();

		// here you can do something with the three results
		//console.log(result1);
		max_id_parcel = result1[0].max_id_parcel;
		max_id_parcel++;

		//console.log(result2);
		for (let i=0; i<result2.length; i++) {
			arr_parcel_codes.push(result2[i].code);
		}
		console.log(arr_parcel_codes);

		max_id_transaction = result3[0].max_id_transaction;
		console.log(max_id_transaction);
		max_id_transaction++;

		var result;
		for (let i=0;i<num_files;i++) {
		//for (let i=0;i<4;i++) {
			//columnes
			for (let j=0;j<num_columnes;j++) {
			//for (let j=0;j<4;j++) {
				let point1 = arr_tesselles[i][j][0];
				let point2 = arr_tesselles[i][j][1];
				let point3 = arr_tesselles[i][j][2];
				let point4 = arr_tesselles[i][j][3];
				if (inside(point1, multipolygon_coast) && inside(point2, multipolygon_coast) && inside(point3, multipolygon_coast) && inside(point4, multipolygon_coast)) {
					
					var code = codis[i] + "-" + codis[j];
					let cad_sql = `INSERT INTO PARCEL VALUES (${max_id_parcel},'${code}', ${point1[1]}, ${point1[0]}, 30000.00)`;
					//console.log(cad_sql);
					result = await queryInsert(cad_sql);
					if(result) {
						console.log('parcel·la inserida');
					} else {
						console.log('parcel·la duplicada');						
					}

					//quan es crea una nova parcel·la, el propietari és el id_owner=1 (admin)
					cad_sql = `INSERT INTO TRANSACTION VALUES (${max_id_transaction},'${max_id_parcel}', 1, '2021-10-09 00:00:00', 30000.00)`;
					//console.log(cad_sql);
					result = await queryInsert(cad_sql);
					if(result) {
						console.log('transacció inserida');
						max_id_parcel++;
						max_id_transaction++;
					} else {
						console.log('transacció duplicada');						
					}
				}
			}
		}

		//ara ja podem tancar la connexió
		conn.end();
	} catch(error){
		console.log(error)
	}

}

//aqui és on executem les queries i els inserts, de forma asícrona però seqüencial
sequentialQueries();
*/

// FASE 5: A partir de la consulta a la bd, podem generar el fitxer geojson. Allò important és que ara ja tenim informació de quins són els propietaris,
// i aquesta informació provinent de la bd quedarà incorporada en el geojson.

var conn = require("./connection.js");

var queryPromise4 = () =>{
    return new Promise((resolve, reject)=>{
    	//consulta: parcel·les i propietari actual
        conn.query('SELECT P.id_parcel, lat, lon, id_transaction, code, O.id_owner, name, surname, price FROM PARCEL P INNER JOIN TRANSACTION T ON P.id_parcel=T.id_parcel INNER JOIN OWNER O ON T.id_owner=O.id_owner WHERE id_transaction IN (select max(id_transaction) from PARCEL P INNER JOIN TRANSACTION T ON P.id_parcel=T.id_parcel GROUP BY P.id_parcel) ORDER BY P.id_parcel',  (error, results)=>{
            if(error){
                return reject(error);
            }
            return resolve(results);
        });
    });
};

var cad = '{"type":"FeatureCollection","features":[';
cad = cad + '\n';

async function propietarisParcelles () {
 
	try{
		const resultPropietaris = await queryPromise4();
		//console.log(resultPropietaris);
		for (let i=0;i<resultPropietaris.length;i++) {
			//console.log(resultPropietaris[i].code);
			//console.log(resultPropietaris[i].id_owner);
			if (i!=0) cad = cad + ',\n';
			let lat1 = parseFloat(resultPropietaris[i].lat);
			let lon1 = parseFloat(resultPropietaris[i].lon);
			let lat2 = lat1;
			let lon2 = (lon1 + 0.0005).toFixed(4);
			let lat3 = (lat1 - 0.0005).toFixed(4);
			let lon3 = lon2;
			let lat4 = lat3;
			let lon4 = lon1;
			let nom_complet = "";
			if (resultPropietaris[i].id_owner == 1) {
				nom_complet = resultPropietaris[i].surname;
			} else {
				nom_complet = resultPropietaris[i].name + " " + resultPropietaris[i].surname;
			}
			cad = cad + `{"type":"Feature","code":"${resultPropietaris[i].code}","properties":{"id_parcel":"${resultPropietaris[i].id_parcel}", "code":"${resultPropietaris[i].code}", "id_owner":${resultPropietaris[i].id_owner}, "owner":"${nom_complet}", "price":${resultPropietaris[i].price}},"geometry":{"type":"Polygon","coordinates":[[[${lon1},${lat1}],[${lon2},${lat2}],[${lon3},${lat3}],[${lon4},${lat4}]]]}}`;

		}
		cad = cad + '\n]}';
		
		//ara ja podem tancar la connexió
		conn.end();

		fs.writeFile('la_palma_newland_211011.json', cad, function (err) {
		  if (err) return console.log(err);
		  console.log('hem creat el fitxer la_palma_newland_211011.json');
		});

	} catch(error){
		console.log(error)
	}
}

propietarisParcelles();

// =====================================================================================

// https://stackoverflow.com/questions/22521982/check-if-point-is-inside-a-polygon
function inside(point, vs) {
    // ray-casting algorithm based on
    // https://wrf.ecse.rpi.edu/Research/Short_Notes/pnpoly.html/pnpoly.html
    
    var x = point[0], y = point[1];
    
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
};

/*
//test:
//var polygon = [ [ 1, 1 ], [ 1, 2 ], [ 2, 2 ], [ 2, 1 ] ];
//console.log(inside([ 1.5, 1.5 ], polygon)); // true
//console.log(inside([ 0, 0 ], polygon)); // false
console.log(inside([-17.9262,28.6125], multipolygon_coast));
*/