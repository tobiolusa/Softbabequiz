<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$name = filter_var($_POST['name'] ?? '', FILTER_SANITIZE_STRING);
$email = filter_var($_POST['email'] ?? '', FILTER_SANITIZE_EMAIL);
$instagram = filter_var($_POST['instagram'] ?? '', FILTER_SANITIZE_STRING);
$optin = isset($_POST['optin']) && $_POST['optin'] === 'on';
$finalResult = filter_var($_POST['finalResult'] ?? '', FILTER_SANITIZE_STRING);
$answers = filter_var($_POST['answers'] ?? '', FILTER_SANITIZE_STRING);

$errors = [];
if (empty($name)) {
    $errors[] = 'Name is required';
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Valid email is required';
}
if (empty($instagram)) {
    $errors[] = 'Instagram handle is required';
}
if (!$optin) {
    $errors[] = 'Opt-in is required';
}
if (empty($finalResult) && empty($answers)) {
    $errors[] = 'Quiz data is missing';
}

if (!empty($errors)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => implode(', ', $errors)]);
    exit;
}

$to = 'info@quiz.softbabelagos.com';
$subject = 'Softbabe Quiz Submission';
$body = "New Softbabe Quiz Submission\n\n";
$body .= "Form Data:\n";
$body .= "Name: $name\n";
$body .= "Email: $email\n";
$body .= "Instagram Handle: $instagram\n\n";
$body .= "Quiz Data:\n";
$body .= "Final Result: $finalResult\n";
$body .= "Answers: $answers\n";
$headers = "From: no-reply@quiz.softbabelagos.com\r\n";
$headers .= "Reply-To: $email\r\n";

$mailSent = mail($to, $subject, $body, $headers);

if ($mailSent) {
    echo json_encode(['success' => true, 'message' => 'Data submitted successfully']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send email']);
}
?>