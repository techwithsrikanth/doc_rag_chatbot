import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = ({ onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [assetID, setAssetID] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append('document', file);

    try {
      const response = await axios.post('http://localhost:5000/api/documents/process', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setAssetID(response.data.assetID);
      onUploadComplete(response.data.assetID);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <h2>Upload Document</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>
      {assetID && <p>Asset ID: {assetID}</p>}
    </div>
  );
};

export default FileUpload;
