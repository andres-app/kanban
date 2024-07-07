<?php
$projectId = $_GET['project'];
$data = json_decode(file_get_contents('php://input'), true);
file_put_contents("data-$projectId.json", json_encode($data));
?>
