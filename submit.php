<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://quiz.softbabelagos.com');
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

// Admin email
$to_admin = 'info@quiz.softbabelagos.com';
$subject_admin = 'Softbabe Quiz Submission';
$body_admin = "New Softbabe Quiz Submission\n\n";
$body_admin .= "Form Data:\n";
$body_admin .= "Name: $name\n";
$body_admin .= "Email: $email\n";
$body_admin .= "Instagram Handle: $instagram\n\n";
$body_admin .= "Quiz Data:\n";
$body_admin .= "Final Result: $finalResult\n";
$body_admin .= "Answers: $answers\n";
$headers_admin = "From: info@quiz.softbabelagos.com\r\n";
$headers_admin .= "Reply-To: $email\r\n";
$headers_admin .= "Content-Type: text/plain; charset=UTF-8\r\n";

// User confirmation email
$to_user = $email;
$subject_user = 'You’re officially on the Softbabe waitlist 💋';
$body_user = "Hey babe,\n\n";
$body_user .= "You just took the first step to finding your Softbabe style and we’re obsessed already.\n\n";
$body_user .= "And now that you’re officially on the waitlist, here’s the tea:\n\n";
$body_user .= "Only 100 Softbabe Boxes are being released first\n";
$body_user .= "Each one is handpicked, curated to your style, and comes with an exclusive Softbabe essential purse.\n\n";
$body_user .= "As a waitlist babe, you’ll get early access to pre-order before the official drop\n";
$body_user .= "Once they’re gone, they’re gone.\n";
$body_user .= "No restocks on this drop.\n\n";
$body_user .= "Pre-order your Softbabe Box & Essential Purse now — secure your spot before it sells out.\n\n";
$body_user .= "With love,\n";
$body_user .= "Softbabe Lagos 💕\n\n";
$body_user .= "[Take the Quiz Again] or [Share with a Friend] [Preorder your Box]\n";
$body_user .= "Take the Quiz Again: https://quiz.softbabelagos.com\n";
$body_user .= "Share with a Friend: https://quiz.softbabelagos.com\n";
$body_user .= "Preorder your Box: https://quiz.softbabelagos.com\n";
$headers_user = "From: info@quiz.softbabelagos.com\r\n";
$headers_user .= "Reply-To: info@quiz.softbabelagos.com\r\n";
$headers_user .= "Content-Type: text/plain; charset=UTF-8\r\n";

$mail_admin_sent = mail($to_admin, $subject_admin, $body_admin, $headers_admin);
$mail_user_sent = mail($to_user, $subject_user, $body_user, $headers_user);

if ($mail_admin_sent && $mail_user_sent) {
    echo json_encode(['success' => true, 'message' => 'Data submitted successfully']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Failed to send one or both emails']);
}
?>