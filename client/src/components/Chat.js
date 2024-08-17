import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Chat.css';

const Chat = ({ assetID, chatThreadID: initialChatThreadID, onNewChatThreadID }) => {
  const [chatThreadID, setChatThreadID] = useState(initialChatThreadID);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isChatStarted, setIsChatStarted] = useState(false);

  useEffect(() => {
    if (initialChatThreadID) {
      setChatThreadID(initialChatThreadID);
      fetchChatHistory(initialChatThreadID);
    }
  }, [initialChatThreadID]);
  const startChat = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/chat/start', { assetID });
      const newChatThreadID = response.data.chatThreadID;
      setChatThreadID(newChatThreadID);
      setChatHistory([]); 
      setIsChatStarted(true);
      onNewChatThreadID(newChatThreadID);  
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };
  const sendMessage = async () => {
    if (!chatThreadID) return;

    try {
      const response = await axios.post('http://localhost:5000/api/chat/message', {
        chatThreadID,
        message,
        assetID,
      });
      setChatHistory((prevHistory) => [...prevHistory, { user: message, agent: response.data.response }]);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const fetchChatHistory = async (threadID = chatThreadID) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/chat/history?chatThreadID=${threadID}`);
      setChatHistory(response.data.history);
    } catch (error) {
      console.error('Error retrieving chat history:', error);
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat</h2>
      <p><strong>Current Chat Thread ID:</strong> {chatThreadID}</p>
      <button className="start-chat-button" onClick={startChat}>Start New Chat</button>
      <div className="chat-box">
        <div className="chat-history">
          {chatHistory.map((entry, index) => (
            <div key={index} className="chat-entry">
              <div className="chat-bubble user-bubble">
                <strong>You:</strong> {entry.user}
              </div>
              <div className="chat-bubble agent-bubble">
                <strong>Agent:</strong> {entry.agent}
              </div>
            </div>
          ))}
        </div>
        <div className="chat-input-container">
          <input
            type="text"
            className="chat-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message"
          />
          <button className="send-button" onClick={sendMessage} disabled={!chatThreadID}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
