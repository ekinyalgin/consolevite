import React, { useState, useEffect, useContext } from 'react';
import VideoForm from '../components/Videos/VideoForm';
import VideoList from '../components/Videos/VideoList';
import Notification from '../utils/Notification';
import { XCircle } from 'lucide-react';
import { AuthContext } from '../contexts/AuthContext'; // AuthContext'i import edin
import { useNavigate } from 'react-router-dom';

const VideosPage = () => {
    const { user, loading } = useContext(AuthContext); // AuthContext'ten user ve loading state'ini al
    const navigate = useNavigate();
    const [videos, setVideos] = useState([]);
    const [search, setSearch] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [message, setMessage] = useState(null);
    const [offset, setOffset] = useState(0);
    const limit = 10; 

    useEffect(() => {
        if (!loading) {
            if (!user) {
                showNotification('Please log in to access this page.', 'error');
                navigate('/'); // Giriş yapılmamışsa anasayfaya yönlendir
            } else if (user.role !== 'admin') {
                showNotification('Access denied. Admin role required.', 'error');
                navigate('/'); // Admin değilse anasayfaya yönlendir
            } else {
                fetchVideos(true); // Giriş yapıldıysa ve admin ise videoları yükle
            }
        }
    }, [user, loading, navigate]);

    const fetchVideos = async (initialLoad = false) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/videos?limit=${limit}&offset=${initialLoad ? 0 : offset}`);
            const data = await response.json();

            if (initialLoad) {
                setVideos(data); 
            } else {
                setVideos((prevVideos) => [...prevVideos, ...data]);
            }

            setOffset((prevOffset) => prevOffset + limit);
        } catch (error) {
            showNotification('Failed to fetch videos', 'error');
        }
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const toggleForm = () => {
        setIsFormOpen(!isFormOpen);
        setSelectedVideo(null);
    };

    const openEditForm = (video) => {
        setSelectedVideo(video);
        setIsFormOpen(true);
    };

    const showNotification = (msg, type) => {
        setMessage({ text: msg, type });
    };

    const resetForm = () => {
        setSelectedVideo(null);
        setIsFormOpen(false);
    };

    const filteredVideos = videos.filter(video => video.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div>
            {message && <Notification message={message.text} type={message.type} onClose={() => setMessage(null)} />}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <h1>
                        Videos <button onClick={toggleForm}>{isFormOpen ? '-' : '+'}</button>
                    </h1>
                    {isFormOpen && (
                        <div>
                            <VideoForm fetchVideos={() => fetchVideos(true)} selectedVideo={selectedVideo} showNotification={showNotification} />
                            {selectedVideo && <XCircle onClick={resetForm} className="cursor-pointer text-gray-600 hover:text-gray-800" />}
                        </div>
                    )}
                    <input
                        type="text"
                        placeholder="Search by title"
                        value={search}
                        onChange={handleSearch}
                    />
                    <VideoList videos={filteredVideos} fetchVideos={() => fetchVideos(true)} setSelectedVideo={openEditForm} showNotification={showNotification} />
                    
                    {videos.length % limit === 0 && (
                        <button onClick={() => fetchVideos()} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                            Load More
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default VideosPage;
