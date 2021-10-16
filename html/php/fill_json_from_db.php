<?php
header('Access-Control-Allow-Origin: *');

$pwd = file_get_contents('./.pwd');
$conn = mysqli_connect("localhost", "alumne", $pwd);
if (!$conn) {
    $log->error('Could not connect: ' . mysql_error());
    die('Could not connect: ' . mysql_error());
}
mysqli_select_db($conn,"la_palma") or die('Could not select la_palma database.');
mysqli_set_charset($conn, 'utf8');

$sql = "SELECT P.id_parcel, code, lat, lon, O.id_owner, name, surname, price FROM PARCEL P INNER JOIN TRANSACTION T ON P.id_parcel=T.id_parcel INNER JOIN OWNER O ON T.id_owner=O.id_owner WHERE id_transaction IN (select max(id_transaction) from PARCEL P INNER JOIN TRANSACTION T ON P.id_parcel=T.id_parcel GROUP BY P.id_parcel) ORDER BY P.id_parcel";
$res = mysqli_query($conn,$sql);

$data = array();

while($row = mysqli_fetch_array($res, MYSQLI_ASSOC)) {
    $data[] = $row;
}

mysqli_free_result($res);

//echo json_encode($data);
$res = "{\"features\":".json_encode($data)."}";
echo $res;

mysqli_close($conn);

?>