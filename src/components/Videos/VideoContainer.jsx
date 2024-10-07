import React, { useState, useEffect, useCallback } from 'react';
import VideoForm from './VideoForm';
import VideoList from './VideoList';
import VideoControls from './VideoControls';
import Notification from '../../utils/Notification';
import ToggleFormButton from '../common/ToggleFormButton';
import { fetchVideos, saveVideo, deleteVideo } from './videoServices';

const VideoContainer = () => {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [notification, setNotification] = useState(null);
  const [offset, setOffset] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const limit = 10;  // Eklenen satır (limit değişkeni tanımlanmamıştı)

  useEffect(() => {
    const storedFormOpen = localStorage.getItem('videoFormOpen');
    if (storedFormOpen !== null) {
      setIsFormOpen(JSON.parse(storedFormOpen));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('videoFormOpen', JSON.stringify(isFormOpen));
  }, [isFormOpen]);

  useEffect(() => {
    loadVideos(true);
  }, []);  // Bileşen yüklendiğinde videoları yükle

  const loadVideos = async (initialLoad = false) => {
    try {
      const newVideos = await fetchVideos(initialLoad ? 0 : offset, limit);
      if (initialLoad) {
        setVideos(newVideos);
      } else {
        setVideos(prevVideos => [...prevVideos, ...newVideos]);
      }
      setOffset(prevOffset => prevOffset + limit);
    } catch (error) {
      console.error('Error loading videos:', error);
      showNotification(error.message || 'Failed to fetch videos', 'error');
    }
  };

  const handleSave = async (video) => {
    try {
      const savedVideo = await saveVideo(video);
      if (video.id) {
        setVideos(videos.map(v => v.id === savedVideo.id ? savedVideo : v));
      } else {
        setVideos([savedVideo, ...videos]);
      }
      setSelectedVideo(savedVideo); // Form açık kalması için bu satırı değiştirdik
      showNotification('Video saved successfully', 'success');
    } catch (error) {
      console.error('Error saving video:', error);
      showNotification(error.message || 'Failed to save video', 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteVideo(id);
      setVideos(videos.filter(video => video.id !== id));
      showNotification('Video deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting video:', error);
      showNotification(error.message || 'Failed to delete video', 'error');
    }
  };

  const toggleDone = async (id) => {
    try {
      const videoToUpdate = videos.find(video => video.id === id);
      if (videoToUpdate) {
        const updatedVideo = { ...videoToUpdate, done: !videoToUpdate.done };
        const savedVideo = await saveVideo(updatedVideo);
        setVideos(videos.map(video => video.id === id ? savedVideo : video));
        showNotification('Video status updated successfully', 'success');
      }
    } catch (error) {
      console.error('Error toggling done status:', error);
      showNotification(error.message || 'Failed to update video status', 'error');
    }
  };

  const handleRandomSelect = () => {
    if (videos.length > 0) {
      const randomVideo = videos[Math.floor(Math.random() * videos.length)];
      window.open(randomVideo.url, '_blank');
    } else {
      showNotification('No videos available', 'error');
    }
  };

  const toggleForm = useCallback(() => {
    setIsFormOpen(prev => {
      const newState = !prev;
      localStorage.setItem('videoFormOpen', JSON.stringify(newState));
      return newState;
    });
    if (isFormOpen) {
      setSelectedVideo(null);
    }
  }, [isFormOpen]);

  const handleFormReset = useCallback(() => {
    setSelectedVideo(null);
    // setIsFormOpen(false); // Bu satırı kaldırıyoruz
  }, []);

  const showNotification = (text, type) => {
    setNotification({ message: text, type }); // Bu satırı değiştirdik
  };

  return (
        <div className="container mx-auto p-2">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <h1 className="text-2xl font-bold mb-4">Videos</h1>
      <div className="sm:space-x-8 flex flex-col md:flex-row">
      <div className={`sm:bg-gray-100 rounded-lg sm:p-5 w-full md:w-3/12 mb-5 md:mb-0 ${isFormOpen ? 'block' : 'hidden'}`}>
          <VideoForm
            selectedVideo={selectedVideo}
            onSave={handleSave}
            onCancel={handleFormReset} 
          />
        </div>
        <div className={`${isFormOpen ? 'lg:w-9/12' : 'w-full'}`}>
        
         
          <VideoList
            videos={videos}
            setSelectedVideo={(video) => {
              setSelectedVideo(video);
              setIsFormOpen(true);
            }}
            onDelete={handleDelete}
            toggleDone={toggleDone}
          />
           <VideoControls
            fetchVideos={() => loadVideos()}
            goToRandomVideo={handleRandomSelect}
            videosLength={videos.length}
            limit={limit}
          />
        </div>

      </div>
      <ToggleFormButton isOpen={isFormOpen} onClick={toggleForm} />
    </div>
  );
};

export default VideoContainer;
