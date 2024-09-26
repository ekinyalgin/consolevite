import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductionComponent = () => {
  const [videos, setVideos] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get('/api/production/videos');
      setVideos(response.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('video', file);

    try {
      await axios.post('/api/production/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      fetchVideos();
      setFile(null);
    } catch (error) {
      console.error('Error uploading video:', error);
    }
  };

  const handleDelete = async (videoId) => {
    try {
      await axios.delete(`/api/production/videos/${videoId}`);
      fetchVideos();
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  return (
    <div className="production-component">
      <h2>Upload Video</h2>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} accept="video/*" />
        <button type="submit">Upload</button>
      </form>

      <h2>Video List</h2>
      <ul>
        {videos.map((video) => (
          <li key={video.id}>
            {video.filename}
            <a href={`/api/production/videos/${video.id}/download`} download>Download</a>
            <button onClick={() => handleDelete(video.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductionComponent;