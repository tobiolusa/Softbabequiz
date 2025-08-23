<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Collect form data
    $name = htmlspecialchars($_POST['name']);
    $email = htmlspecialchars($_POST['email']);
    $answers = json_decode($_POST['answers'], true); // Answers sent as JSON

    // Validate inputs
    if (empty($name) || empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid name or email']);
        exit;
    }

    if (empty($answers)) {
        http_response_code(400);
        echo json_encode(['error' => 'No quiz answers provided']);
        exit;
    }

    // Format answers for email
    $answers_text = "Quiz Answers:\n";
    foreach ($answers as $question => $answer) {
        $answers_text .= "$question: $answer\n";
    }

    // Email details
    $to = "olusamiracle@gmail.com";
    $subject = "Softbabe Style Quiz Submission from $name";
    $message = "Name: $name\nEmail: $email\n\n$answers_text";
    $headers = "From: no-reply@softbabelagos.com\r\n" .
               "Reply-To: $email\r\n" .
               "Content-Type: text/plain; charset=UTF-8\r\n";

    // Send email
    if (mail($to, $subject, $message, $headers)) {
        echo json_encode(['success' => 'Quiz submitted successfully!']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to send email']);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>