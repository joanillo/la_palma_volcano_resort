var cad_enunciat = "";
var cad_sql = "";
var cad = "";

function SQL() {
	//cad = "Consultes SQL";
	cad_enunciat = "Totes les transaccions que hi ha hagut sobre la parcel·la F-N";
	cad_sql = "SELECT id_transaction, date_transaction, P.id_parcel, code, price, name, surname FROM PARCEL P INNER JOIN TRANSACTION T ON P.id_parcel=T.id_parcel INNER JOIN OWNER O ON T.id_owner=O.id_owner WHERE code='F-N'";
	consultaSQL(cad_enunciat, cad_sql);

	cad_enunciat = "Les últimes transaccions que s'han fet de cada parcel·la (sense comptar la transacció inicial de quan es crea la parcel·la)";
	cad_sql = "select max(id_transaction), P.id_parcel, max(date_transaction) from PARCEL P INNER JOIN TRANSACTION T ON P.id_parcel=T.id_parcel WHERE date_transaction > '2021-10-09 00:00:00' GROUP BY id_parcel ORDER BY P.id_parcel";
	consultaSQL(cad_enunciat, cad_sql);

	cad_enunciat = "Parcel·les i propietari actual (que no sigui el admin)";
	cad_sql = "SELECT P.id_parcel, id_transaction, code, name, surname FROM PARCEL P INNER JOIN TRANSACTION T ON P.id_parcel=T.id_parcel INNER JOIN OWNER O ON T.id_owner=O.id_owner WHERE id_transaction IN (select max(id_transaction) from PARCEL P INNER JOIN TRANSACTION T ON P.id_parcel=T.id_parcel WHERE O.id_owner!=1 GROUP BY P.id_parcel) ORDER BY P.id_parcel";
	consultaSQL(cad_enunciat, cad_sql);

	cad_enunciat = "parcel·les lliures (parcel·les que el propietari és el id_owner=1)";
	cad_sql = "SELECT P.id_parcel, code FROM PARCEL P INNER JOIN TRANSACTION T ON P.id_parcel=T.id_parcel INNER JOIN OWNER O ON T.id_owner=O.id_owner WHERE id_transaction IN (select max(id_transaction) from PARCEL P INNER JOIN TRANSACTION T ON P.id_parcel=T.id_parcel GROUP BY P.id_parcel) AND O.id_owner=1 ORDER BY P.id_parcel;";
	consultaSQL(cad_enunciat, cad_sql);
	
	return cad;

}

function consultaSQL(cad_enunciat, cad_sql) {

  var xmlhttp;
  xmlhttp=new XMLHttpRequest();
  xmlhttp.onreadystatechange=function() {

    if (xmlhttp.readyState==4 && xmlhttp.status==200) {
    	var info = document.getElementById('info');
		cad = '<h3>' + cad_enunciat + "</h3>";
		cad += '<p>' + cad_sql + '</p>';
		let jsonString = xmlhttp.responseText;
		let jsonPretty = JSON.stringify(JSON.parse(jsonString),null,2);  
		cad += '<pre>' + jsonPretty + '</pre>';
		info.innerHTML += cad;
		//console.log(cad);
    }
  }

  xmlhttp.open("POST","http://localhost/LPVR/php/consultaSQL.php", true)
  xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xmlhttp.send("cad_sql=" + cad_sql);
}

export default SQL;