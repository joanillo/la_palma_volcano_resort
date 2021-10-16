<?php
	header('Access-Control-Allow-Origin: *');
	$cad_sql = trim($_POST['cad_sql']);

	$pwd = file_get_contents('./.pwd');
	$conn = mysqli_connect("localhost", "alumne", $pwd);
	if (!$conn) {
	    $log->error('Could not connect: ' . mysql_error());
	    die('Could not connect: ' . mysql_error());
	}
	mysqli_select_db($conn,"la_palma") or die('Could not select la_palma database.');
	mysqli_set_charset($conn, 'utf8');

	$res = mysqli_query($conn,$cad_sql);

	$data = array();

	while($row = mysqli_fetch_array($res, MYSQLI_ASSOC)) {
	    $data[] = $row;
	}

	mysqli_free_result($res);

	//echo json_encode($data);
	$res = json_encode($data);
	echo $res;


	mysqli_close($conn);
	//echo $cad_sql;

?>