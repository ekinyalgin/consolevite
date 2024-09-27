import React, { useState, useEffect } from 'react';
import VideoForm from '../components/Videos/VideoForm';
import VideoList from '../components/Videos/VideoList';
import Notification from '../utils/Notification';
import tableClasses from '../utils/tableClasses';
import { Plus, X } from 'lucide-react'; // Plus ve X ikonlarını ekliyoruz

const VideosPage = () => {
    const [videos, setVideos] = useState([]);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [message, setMessage] = useState(null);
    const [offset, setOffset] = useState(0);
    const [isFormOpen, setIsFormOpen] = useState(false); // Formun açık/kapalı durumunu kontrol eden state
    const limit = 10;

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                return;
            }
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
        setIsFormOpen(true); // Düzenleme için formu aç
    };

    const showNotification = (msg, type) => {
        setMessage({ text: msg, type });
    };

    const resetForm = () => {
        setSelectedVideo(null);
        setIsFormOpen(false); // Formu kapat
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
                <div className={`sm:bg-gray-100 rounded-lg sm:p-5 w-full md:w-3/12 mb-5 md:mb-0 ${isFormOpen ? '' : 'hidden md:block'}`}>
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

            {/* Formu aç/kapa butonu */}
            {!isFormOpen && (
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-md hover:bg-blue-700 transition duration-300 md:hidden"
                >
                    <Plus className="w-4 h-4" strokeWidth={3} />
                </button>
            )}

            {/* <Check className={tableClasses.checkIconBlack} strokeWidth={3} /> */}
            {isFormOpen && (
                <button
                    onClick={() => setIsFormOpen(false)}
                    className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-full shadow-md hover:bg-red-700 transition duration-300 md:hidden"
                >
                    <X className="w-4 h-4" strokeWidth={3} />
                </button>
            )}
        </div>
    );
};

export default VideosPage;
