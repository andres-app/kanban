<?php
$project = $_GET['project'] ?? '';
if (!$project) exit;

$file = __DIR__ . "/data-$project.json";
if (file_exists($file)) unlink($file);

echo 'OK';
