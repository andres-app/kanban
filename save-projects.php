<?php
header('Content-Type: application/json');

$data = file_get_contents("php://input");

if ($data === false || empty($data)) {
    http_response_code(400);
    echo json_encode([
        'error' => 'No data received'
    ]);
    exit;
}

$result = file_put_contents(__DIR__ . '/projects.json', $data, LOCK_EX);

if ($result === false) {
    http_response_code(500);
    echo json_encode([
        'error' => 'No se pudo escribir projects.json'
    ]);
    exit;
}

echo json_encode([
    'success' => true
]);
