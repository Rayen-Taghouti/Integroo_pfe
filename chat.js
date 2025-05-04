document.addEventListener('DOMContentLoaded', function () {
    const sendButton = document.querySelector('.btn_send');
    const messageInput = document.getElementById('chat-input');
    const chatBox = document.querySelector('.chat_box');
    const currentUserId = parseInt(document.getElementById('current-user-id').value); // Hidden input for current user ID
    const receiverId = parseInt(document.getElementById('receiver-user-id').value); // Hidden input for receiver user ID

    // Function to format time for display
    function formatTime(dateString) {
        const date = new Date(dateString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    // Function to add a message to the chat box
    function addMessageToChatBox(content, time, isSender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = isSender ? 'msg me' : 'msg'; // Apply the "me" class for sender
        messageDiv.innerHTML = `
            <div class="chat">
                <div class="profile">
                    <span class="time">${time}</span>
                </div>
                <p>${content}</p>
            </div>
        `;
        chatBox.appendChild(messageDiv);
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
    }

    // Handle the send button click event
    sendButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent form submission

        const content = messageInput.value.trim();
        if (!content) return; // Do nothing if input is empty

        // Send the message via AJAX
        fetch('send_message_dashbord.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                content: content,
                receiver_id: receiverId,
            }),
        })
            .then((response) => {
                if (!response.ok) throw new Error('Failed to send message');
                return response.json();
            })
            .then((data) => {
                // Add the new message to the chat box
                addMessageToChatBox(data.content, formatTime(data.created_at), true);
                messageInput.value = ''; // Clear the input field
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    });
});