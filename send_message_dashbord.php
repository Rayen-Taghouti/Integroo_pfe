<?php
session_start();
$pdo = new PDO('mysql:host=localhost;dbname=integroo', 'root', '');

// Ensure the user is logged in
if (!isset($_SESSION['user_id'])) {
    header('HTTP/1.1 401 Unauthorized');
    echo json_encode(['error' => 'User not logged in']);
    exit();
}

$currentUserId = $_SESSION['user_id']; // Current user ID from session
$receiverId = $_POST['receiver_id'] ?? 0; // Receiver ID from the frontend
$content = trim($_POST['content'] ?? ''); // Message content from the frontend

if (empty($content)) {
    header('HTTP/1.1 400 Bad Request');
    echo json_encode(['error' => 'Message content is required']);
    exit();
}

// Insert the message into the database
$sql = "INSERT INTO messages (sender_id, receiver_id, content, is_read, created_at) 
        VALUES (:sender_id, :receiver_id, :content, 1, NOW())";

$stmt = $pdo->prepare($sql);
$result = $stmt->execute([
    'sender_id' => $currentUserId,
    'receiver_id' => $receiverId,
    'content' => $content
]);

if ($result) {
    $messageId = $pdo->lastInsertId();

    // Fetch the newly created message to return as a response
    $sql = "SELECT id, content, created_at 
            FROM messages 
            WHERE id = :message_id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['message_id' => $messageId]);
    $message = $stmt->fetch(PDO::FETCH_ASSOC);

    header('Content-Type: application/json');
    echo json_encode($message); // Return the message details
} else {
    header('HTTP/1.1 500 Internal Server Error');
    echo json_encode(['error' => 'Failed to send message']);
}
?>