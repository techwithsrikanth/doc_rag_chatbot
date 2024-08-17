import React, { useState, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import Chat from './components/Chat';
import './App.css';

const App = () => {
  const [assetID, setAssetID] = useState(null);
  const [manualChatThreadID, setManualChatThreadID] = useState('');
  const [chatThreads, setChatThreads] = useState([]);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [currentChatThreadID, setCurrentChatThreadID] = useState(null);

  const handleManualChatThreadIDChange = (e) => {
    setManualChatThreadID(e.target.value);
  };

  const handleFetchChatHistory = () => {
    setShowChatHistory(true);
    setCurrentChatThreadID(manualChatThreadID);
  };

  const handleUploadComplete = (id) => {
    setAssetID(id);
    setShowChatHistory(false);
    setManualChatThreadID('');
    setCurrentChatThreadID(null); 
  };
  const handleNewChatThreadID = (newChatThreadID) => {
    setChatThreads((prevThreads) => [newChatThreadID, ...prevThreads]);
    setCurrentChatThreadID(newChatThreadID);
    setShowChatHistory(false);
  };
  useEffect(() => {
    console.log('Current Chat Thread ID:', currentChatThreadID);
  }, [currentChatThreadID]);

  return (
    <div className="app-container">
      <div className="main-content">
        <h1>Document Processing and RAG Chatbot</h1>
        <FileUpload onUploadComplete={handleUploadComplete} />
        <Chat assetID={assetID} chatThreadID={currentChatThreadID} onNewChatThreadID={handleNewChatThreadID} />
        <br />
        <h2>Retrieve Chat History</h2>
        <input
          type="text"
          value={manualChatThreadID}
          onChange={handleManualChatThreadIDChange}
          placeholder="Enter chat thread ID"
        />
        <button onClick={handleFetchChatHistory} disabled={!manualChatThreadID}>
          Get Chat History
        </button>
        {showChatHistory && currentChatThreadID && (
          <Chat assetID={null} chatThreadID={currentChatThreadID} onNewChatThreadID={() => {}} />
        )}
      </div>
      <div className="sidebar">
        <h3>Previous Chat Threads</h3>
        <ul>
          {chatThreads.map((threadID, index) => (
            <li key={index}>{threadID}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
