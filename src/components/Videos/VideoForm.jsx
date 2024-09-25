import React, { useState, useEffect } from 'react';
import tableClasses from '../../utils/tableClasses';
import { XCircle } from 'lucide-react';

const VideoForm = ({ fetchVideos, selectedVideo, showNotification, resetForm }) => {
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
                fetchVideos();
                showNotification(selectedVideo ? 'Video updated successfully' : 'Video added successfully', 'success');
                setTitle('');
                setUrl('');
                setNote('');
                resetForm();
            } else {
                const errorData = await response.json();
                showNotification(`Failed to ${selectedVideo ? 'update' : 'add'} video: ${errorData.error || 'Unknown error'}`, 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification(`Failed to ${selectedVideo ? 'update' : 'add'} video: ${error.message}`, 'error');
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
