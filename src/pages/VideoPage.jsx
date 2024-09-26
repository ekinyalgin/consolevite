import React, { useState, useEffect } from 'react';
import VideoForm from '../components/Videos/VideoForm';
import VideoList from '../components/Videos/VideoList';
import Notification from '../utils/Notification';
import tableClasses from '../utils/tableClasses';

const VideosPage = () => {
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [message, setMessage] = useState(null);
    const [offset, setOffset] = useState(0);
    const limit = 10; 

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                // Redirect to login page or show error
                return;
            }
            // Optionally, verify token with server
            fetchVideos(true);
        };
        checkAuth();
    }, []);

    const fetchVideos = async (initialLoad = false) => {
        try {
            const token = localStorage.getItem('token');
            
            const response = await fetch(`${import.meta.env.VITE_API_URL}/videos?limit=${limit}&offset=${initialLoad ? 0 : offset}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch videos');
            }

            const data = await response.json();

            if (initialLoad) {
                setVideos(data); 
            } else {
                setVideos((prevVideos) => [...prevVideos, ...data]);
            }

            setOffset((prevOffset) => prevOffset + limit);
        } catch (error) {
            console.error('Error fetching videos:', error);
            showNotification(error.message || 'Failed to fetch videos', 'error');
        }
    };

    const openEditForm = (video) => {
        setSelectedVideo(video);
    };

    const showNotification = (msg, type) => {
        setMessage({ text: msg, type });
    };

    const resetForm = () => {
        setSelectedVideo(null);
    };

    const goToRandomVideo = () => {
        if (videos.length > 0) {
            const randomIndex = Math.floor(Math.random() * videos.length);
            const randomVideo = videos[randomIndex];
            window.open(randomVideo.url, '_blank');
        } else {
            showNotification('No videos available', 'error');
        }
    };

    return (
        <div className="container mx-auto p-2">
            {message && <Notification message={message.text} type={message.type} onClose={() => setMessage(null)} />}
            <h1 className={tableClasses.h1}>Videos</h1>
            <div className="sm:space-x-8 flex flex-col md:flex-row">
                <div className="sm:bg-gray-100 rounded-lg sm:p-5 w-full md:w-3/12 mb-5 md:mb-0">
                    <VideoForm 
                        fetchVideos={() => fetchVideos(true)} 
                        selectedVideo={selectedVideo} 
                        showNotification={showNotification}
                        resetForm={resetForm}
                        setVideos={setVideos} 
                        videos={videos}
                    />
                </div>
                <div className="lg:w-9/12">
                    <VideoList 
                        videos={videos} 
                        fetchVideos={() => fetchVideos(true)} 
                        setSelectedVideo={openEditForm} 
                        showNotification={showNotification} 
                        setVideos={setVideos} 
                    />
                    
                    <div className="flex justify-between mt-4">
                        {videos.length % limit === 0 && (
                            <button onClick={() => fetchVideos()} className={tableClasses.transButton}>
                                Load More
                            </button>
                        )}
                        <button onClick={goToRandomVideo} className={tableClasses.transButton}>
                            Random Video
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideosPage;
