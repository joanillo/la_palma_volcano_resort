function INFO() {
	var cad = "";
	cad += "<h3>Introducció</h3>";
	cad+="<p><b>Setembre de 2021</b>: el volcà <b>Cumbre Vieja</b> va entrar en erupció, després de dies de tremolors que van posar en avís la població i les autoritats.</p>";
	cad += "<p>Principis d'<b>octubre de 2021</b>. Una llengua de lava va discórrer per la vall de Todoque, va arribar al mar, i va formar un delta de lava. L'hem anomenat Nous Territoris (sector I).</p>";
	cad += "<p><b>14 octubre de 2021</b>. Continua fluïnt lava per les faldes del volcà, però ara estan alimentant altres llengües, i per ara aquest delta no es fa més gros.</p>";
	cad += "<h3>Satèl·lit Sentinel-2</h3>";
	//necessari fer la referència a les imatges així per tal de què funcioni en el servidor remot (desplegament públic)
	//cad += "<img src='http://localhost/LPVR/img/sentinel2.jpeg' width='800'><br />";
	cad += "<img src='./img/sentinel2.jpeg' width='800'><br />";
	cad += "<p>La missió <b>Copernicus Sentinel-2</b> de l'ESA (Agència Espacial Europea) consisteix en dos satèl·lits artificials desfasats 180º en la mateixa òrbita. La seva missió és monitoritzar la superfície terrestre. Orbiten a 290Km d'altitud, i revisiten els punts cada 10 dies (5 dies perquè són dos satèl·lits) Més informació: <a href='https://sentinels.copernicus.eu/web/sentinel/missions/sentinel-2' target='_blank'>https://sentinels.copernicus.eu/web/sentinel/missions/sentinel-2</a></p>";
	cad += "<h3>OpenStreetMap</h3>";
	//cad += "<img src='http://localhost/LPVR/img/feina_voluntaris_OSM.png' width='800'><br />";
	cad += "<img src='./img/feina_voluntaris_OSM.png' width='800'><br />";
	cad += "<p>Els voluntaris d'OpenStreetMaps han estat actualitzant la línia de costa a mida de què es disposava de fotogràfies aèries. Cada cop que s'actualitzava el mapa, LPVR SLU ha creat noves parcel·les de terreny de forma dinàmica. La superfície creix, el número de parcel·les augmenta.</p>";	
	cad += "<h3>El projecte</h3>";
	cad += "<ul>";
	cad += "<li>wiki: <a href='http://wiki.joanillo.org/index.php/La_Palma_Volcano_Resort' target='_blank'>http://wiki.joanillo.org/index.php/La_Palma_Volcano_Resort</a></li>";
	cad += "<li>bloc: <a href='http://www.joanillo.org/?cat=514' target='_blank'>http://www.joanillo.org/?cat=514</a></li>";
	cad += "<li>github: <a href='https://github.com/joanillo/la_palma_volcano_resort' target='_blank'>https://github.com/joanillo/la_palma_volcano_resort</a></li>";
	cad += "</ul>";
	return cad;
}

export default INFO;
