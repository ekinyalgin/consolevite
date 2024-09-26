import React, { useState, useEffect } from 'react';
import tableClasses from '../../utils/tableClasses';
import { XCircle } from 'lucide-react';

const VideoForm = ({ fetchVideos, selectedVideo, showNotification, resetForm, setVideos, videos }) => {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [note, setNote] = useState('');

    useEffect(() => {
        if (selectedVideo) {
            setTitle(selectedVideo.title || '');
            setUrl(selectedVideo.url || '');
            setNote(selectedVideo.note || '');
        } else {
            setTitle('');
            setUrl('');
            setNote('');
        }
    }, [selectedVideo]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const method = selectedVideo ? 'PUT' : 'POST';
        const urlEndpoint = selectedVideo
            ? `${import.meta.env.VITE_API_URL}/videos/${selectedVideo.id}`
            : `${import.meta.env.VITE_API_URL}/videos`;

        const videoData = {
            title,
            url,
            note,
        };

        if (selectedVideo) {
            videoData.done = selectedVideo.done;
        }

        let tempId = `temp-${Math.random()}`; // Geçici bir ID oluştur

        // Optimistik güncelleme: UI'ya hemen ekle veya güncelle
        if (!selectedVideo) {
            setVideos([...videos, { ...videoData, id: tempId }]); // Yeni video ekliyoruz
        } else {
            setVideos(videos.map(video => 
                video.id === selectedVideo.id ? { ...video, ...videoData } : video
            )); // Güncelleme yapıyoruz
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(urlEndpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(videoData),
            });

            if (response.ok) {
                const savedVideo = await response.json();
                
                // Sunucu yanıtı geldiğinde optimistik güncellemeyi kesinleştir
                setVideos(prevVideos => prevVideos.map(video => 
                    video.id === tempId ? savedVideo : video // Yeni eklenen video için
                ));

                showNotification(selectedVideo ? 'Video updated successfully' : 'Video added successfully', 'success');
                resetForm();
            } else {
                const errorData = await response.json();
                showNotification(`Failed to ${selectedVideo ? 'update' : 'add'} video: ${errorData.error || 'Unknown error'}`, 'error');
                
                // Hata durumunda optimistik değişiklikleri geri alın
                if (!selectedVideo) {
                    setVideos(videos.filter(video => video.id !== tempId));
                }
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification(`Failed to ${selectedVideo ? 'update' : 'add'} video: ${error.message}`, 'error');

            // Hata durumunda optimistik değişiklikleri geri alın
            if (!selectedVideo) {
                setVideos(videos.filter(video => video.id !== tempId));
            }
        }
    };

    

    return (
        <form onSubmit={handleSubmit} className={tableClasses.formContainer + " space-y-4"}>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className={`${tableClasses.formInput} w-full`}
            />
            <input
                type="url"
                placeholder="URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className={`${tableClasses.formInput} w-full`}
            />
            <textarea
                placeholder="Note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className={`${tableClasses.formInput} w-full`}
                rows="3"
            />
            <div className="flex space-x-2">
                <button type="submit" className={`${tableClasses.formButton} ${selectedVideo ? 'w-4/6' : 'w-full'}`}>
                    {selectedVideo ? 'Update' : 'Add'} Video
                </button>
                {selectedVideo && (
                    <button
                        type="button"
                        onClick={resetForm}
                        className={`${tableClasses.formButton} w-2/6 flex items-center justify-center`}
                    >
                        <XCircle className="w-4 h-4" />
                    </button>
                )}
            </div>
        </form>
    );
};

export default VideoForm;
