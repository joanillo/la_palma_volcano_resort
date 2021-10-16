<?php
header('Access-Control-Allow-Origin: *');
$id_parcel = $_POST['id_parcel'];
$nom = trim($_POST['nom']);
$cognoms = trim($_POST['cognoms']);
$preu = $_POST['preu'];

$pwd = file_get_contents('./.pwd');
$conn = mysqli_connect("localhost", "alumne", $pwd);
if (!$conn) {
    $log->error('Could not connect: ' . mysql_error());
    die('Could not connect: ' . mysql_error());
}
mysqli_select_db($conn,"la_palma") or die('Could not select la_palma database.');
mysqli_set_charset($conn, 'utf8');

// no cal tenir el id_owner. El que hem de fer és mirar el nom+cognom, i veure si aquesta persona ja existeix a la bd, i aleshores aconseguir-ne el id.
// si no existeix el id, serà un insert a owner i un insert a transaction
// si ja existeix el id, serà un insert a transaction amb aquest id.

$sql = "SELECT max(id_owner) as max_id_owner FROM OWNER";
$res = mysqli_query($conn,$sql);
$row = mysqli_fetch_assoc($res);
$max_id_owner = $row['max_id_owner'];

$sql = "SELECT max(id_transaction) as max_id_transaction FROM TRANSACTION";
$res = mysqli_query($conn,$sql);
$row = mysqli_fetch_assoc($res);
$max_id_transaction = $row['max_id_transaction'];
$id_transaction = $max_id_transaction + 1;

$sql = "SELECT code from PARCEL WHERE id_parcel=$id_parcel";
$res = mysqli_query($conn,$sql);
$row = mysqli_fetch_assoc($res);
$code = $row['code'];

$sql = "SELECT id_owner FROM OWNER WHERE name='$nom' AND surname='$cognoms'";
$res = mysqli_query($conn,$sql);
$row = mysqli_fetch_assoc($res);

$cad = "";
$usuari_existent = false;

if(isset($row['id_owner'])){
	//usuari existeix
	//echo $row['id_owner'];
	//echo "Usuari ja existent";
	$cad.="Usuari ja existent.";
	$usuari_existent = true;
	$id_owner = $row['id_owner'];
} else {
	//echo "usuari nou";
	$id_owner = $max_id_owner + 1;
	$sql = "INSERT INTO OWNER(id_owner, name, surname) VALUES ($id_owner,'$nom','$cognoms')";
	$res = mysqli_query($conn,$sql);

	//echo "Usuari afegit";
	$cad.="Usuari afegit.";
}

//quantes parcel·les té aquest usuari?
$sql = "SELECT count(O.id_owner) as num_parcelles FROM PARCEL P INNER JOIN TRANSACTION T ON P.id_parcel=T.id_parcel INNER JOIN OWNER O ON T.id_owner=O.id_owner WHERE id_transaction IN (select max(id_transaction) from PARCEL P INNER JOIN TRANSACTION T ON P.id_parcel=T.id_parcel WHERE O.id_owner=$id_owner GROUP BY P.id_parcel)";
$res = mysqli_query($conn,$sql);
$row = mysqli_fetch_assoc($res);
$num_parcelles = $row['num_parcelles'];

//propietari antic de la parcel·la
$sql = "SELECT O.id_owner old_id_owner FROM PARCEL P INNER JOIN TRANSACTION T ON P.id_parcel=T.id_parcel INNER JOIN OWNER O ON T.id_owner=O.id_owner WHERE id_transaction IN (select max(id_transaction) from PARCEL P INNER JOIN TRANSACTION T ON P.id_parcel=T.id_parcel WHERE P.id_parcel=$id_parcel GROUP BY P.id_parcel)";
$res = mysqli_query($conn,$sql);
$row = mysqli_fetch_assoc($res);
$old_id_owner = $row['old_id_owner'];


if ($num_parcelles >= 5 ) { //REGLA 2
	$cad.="<br />Transacció <b>NO</b> realitzada.<br />Actualment tens $num_parcelles parcel·les. No es pot ser propietari de més de 5 parcel·les";
} else if ($id_owner == $old_id_owner ) { //REGLA 2
	$cad.="<br />Transacció <b>NO</b> realitzada.<br />No es pot recomprar una parcel·la.";
} else {
	//anem a realitzar una compra
	$sql_transaction = "INSERT INTO TRANSACTION VALUES ($id_transaction,$id_parcel,$id_owner,now(), $preu)";
	//echo $sql_transaction;

	$resultset_alumne = mysqli_query($conn,$sql_transaction);

	//echo "<br />Transacció realitzada";
	$cad.="<br />Transacció realitzada";
	$cad.="<br />Descarrega el <a href='http://localhost/LPVR/php/pdf/LPVR_".$id_transaction.".pdf' target='_blank'>títol de propietat</a>";
}
//echo $cad;
mysqli_close($conn);

?>
<?php

//la llibreria TCPDF és millor que FPDF
require('./fpdf183/fpdf.php');

class PDF extends FPDF
{
	function Header()
	{

	}

	function Footer()
	{
		// Position at 1.5 cm from bottom
		$this->SetY(-15);
		// Arial italic 8
		$this->SetFont('Arial','I',8);
		// Text color in gray
		$this->SetTextColor(128);
		// Page number
		$this->Cell(0,10,'Page '.$this->PageNo(),0,0,'C');
	}
}

$pdf = new PDF();
$pdf->AddPage();
$pdf->Image('./fpdf183/tutorial/logo_v4.png',160,6,30);

$lineHeight=4;

$pdf->SetFont('Arial','B',20);
$pdf->Write(5,"\n\nTítol de propietat\n\n\n\n\n");

$pdf->SetFont('Arial','',14);
$pdf->Write(5,"La Palma Volcano Resort (LPVR, SLU), com a representant legal dels Nous Territoris de la Illa de La Palma (Illes Canàries), emet un títol de propietat a favor de $nom $cognoms per la parcel·la $code.\n\n");
$pdf->Write(5,"El preu de compra de la parcel·la $code ha estat de $preu euros.\n\n");
$pdf->Write(5,"El propietari es compromet a respectar el medi natural. La finca té caràcter rústic i no es podrà edificar.\n\n");

$diesSetmana = array("diumenge","dilluns","dimarts","dimecres","dijous","divendres","dissabte");
$mesos = array("gener","febrer","març","abril","maig","juny","juliol","agost","setembre","octubre","novembre","desembre");
$dia = "Barcelona, ".$diesSetmana[date('w')]." ".date('d')." de ".$mesos[date('n')-1]. " del ".date('Y') ;
$pdf->Write(5,"$dia\n\n");

//$pdf->Output();
//$pdf->Output('I','LPVR_'.$id_parcel.'.pdf');
$pdf->Output('./pdf/LPVR_'.$id_transaction.'.pdf','F');

echo $cad;

?>
