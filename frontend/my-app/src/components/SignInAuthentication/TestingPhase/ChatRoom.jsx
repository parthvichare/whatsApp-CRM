import React, { useRef, useEffect, useState } from "react";
import io from "socket.io-client";

const ChatRoom = () => {
  const socket = useRef(null);
  const socketUrl = "http://localhost:8000"; // Backend URL
  const salesAgentId = localStorage.getItem("userId") || "user_123"; // Example userId
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // Store received messages

  useEffect(() => {
    // Initialize socket connection
    socket.current = io(socketUrl);

    // Connection event
    socket.current.on("connect", () => {
      console.log("✅ Connected to the server");
    });

    // Listen for messages from the server
    socket.current.on("receiveMessage", (data) => {
      console.log("📩 Message received:", data);
      setMessages((prevMessages) => [...prevMessages, data]); // Append to chat
    });

    // Cleanup socket on unmount
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  // Function to send a message
  const sendMessage = () => {
    if (message.trim() === "") return;
    
    const messageData = {
      leadPhoneNumber: "919372597458", // Example number
      messageContent: message,
      salesAgentId
    };

    socket.current.emit("sendTextMessage", messageData, (response) => {
      if (response.success) {
        console.log("✅ Message sent:", response.data);
        setMessages((prevMessages) => [...prevMessages, messageData]); // Show sent message
      } else {
        console.error("❌ Error:", response.error);
      }
    });

    socket.current.on("leadMessageReceived", (data) => {
      console.log("Hello")
      console.log("New Message Received:", data);
      // Update UI accordingly
    });
  

    setMessage(""); // Clear input after sending
  };

  return (
    <div>
      <h2>Chat Room</h2>
      <div style={{ height: "300px", overflowY: "scroll", border: "1px solid #ccc", padding: "10px" }}>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.messageBy}:</strong> {msg.messageContent}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default ChatRoom;
