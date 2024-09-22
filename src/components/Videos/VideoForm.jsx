import React, { useState, useEffect } from 'react';

const VideoForm = ({ fetchVideos, selectedVideo, showNotification }) => {
    const [title, setTitle] = useState('');
    const [url, setUrl] = useState('');
    const [note, setNote] = useState('');

    useEffect(() => {
        if (selectedVideo) {
            setTitle(selectedVideo.title || ''); // selectedVideo'daki title doğru bir şekilde set ediliyor mu?
            setUrl(selectedVideo.url || ''); // url
            setNote(selectedVideo.note || ''); // note
        } else {
            // Eğer selectedVideo null ise, formu sıfırla
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
            videoData.done = selectedVideo.done; // Done değerini ekle
        }

        try {
            const response = await fetch(urlEndpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(videoData),
            });

            if (response.ok) {
                fetchVideos();
                showNotification(selectedVideo ? 'Video updated successfully' : 'Video added successfully', 'success');
                setTitle('');
                setUrl('');
                setNote('');
            } else {
                const errorData = await response.json();
                showNotification(`Failed to update video: ${errorData.error}`, 'error');
            }
        } catch (error) {
            showNotification('Failed to save video', 'error');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <input
                type="url"
                placeholder="URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
            />
            <input
                type="text"
                placeholder="Note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
            />
            <button type="submit">{selectedVideo ? 'Update' : 'Add'}</button>
        </form>
    );
};

export default VideoForm;
