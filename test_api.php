<?php
// Simple API test script
// Run with: ./vendor/bin/sail php test_api.php

echo "Testing API endpoints...\n\n";

// Test high score endpoint
echo "1. Testing GET /api/score/high\n";
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost/api/score/high');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Accept: application/json',
    'X-Requested-With: XMLHttpRequest'
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: $httpCode\n";
echo "Response: $response\n\n";

// Test score submission
echo "2. Testing POST /api/score\n";
$data = json_encode(['name' => 'Test Player', 'score' => 100]);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'http://localhost/api/score');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Accept: application/json',
    'X-Requested-With: XMLHttpRequest'
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

echo "HTTP Code: $httpCode\n";
echo "Response: $response\n\n";

echo "Test completed!\n";
