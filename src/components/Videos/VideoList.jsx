import React, { useState } from 'react';
import tableClasses from '../../utils/tableClasses';
import { Check, XCircle, NotebookPen, Edit, Trash2, Plus } from 'lucide-react';

const VideoList = ({ videos, fetchVideos, setSelectedVideo, showNotification }) => {
    const [expandedNoteId, setExpandedNoteId] = useState(null);
    const [togglingDoneId, setTogglingDoneId] = useState(null);

    const toggleDone = async (id, done) => {
        setTogglingDoneId(id);
    
        const videoToUpdate = videos.find(video => video.id === id);
    
        if (!videoToUpdate) {
            showNotification('Video not found', 'error');
            return;
        }
    
        try {
            const updatedVideoData = {
                title: videoToUpdate.title,
                url: videoToUpdate.url,
                note: videoToUpdate.note,
                done: done ? 0 : 1,
            };
    
            const token = localStorage.getItem('token');
            const response = await fetch(`${import.meta.env.VITE_API_URL}/videos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedVideoData),
            });
    
            if (response.ok) {
                fetchVideos();
                showNotification('Video updated successfully', 'success');
            } else {
                const errorData = await response.json();
                showNotification(`Failed to update video: ${errorData.error || 'Unknown error'}`, 'error');
            }
        } catch (error) {
            showNotification(`Failed to update video: ${error.message}`, 'error');
        } finally {
            setTogglingDoneId(null);
        }
    };
    
    const deleteVideo = async (id) => {
        if (window.confirm('Are you sure you want to delete this video?')) {
            try {
                const token = localStorage.getItem('token');
                await fetch(`${import.meta.env.VITE_API_URL}/videos/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                fetchVideos();
                showNotification('Video deleted successfully', 'success');
            } catch (error) {
                showNotification('Failed to delete video', 'error');
            }
        }
    };

    const toggleNote = (id) => {
        setExpandedNoteId(expandedNoteId === id ? null : id);
    };

    const truncateTitle = (title, maxLength = 60) => {
        return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
    };

    return (
        <table className={tableClasses.table}>
            <thead className={tableClasses.tableHeader}>
                <tr>
                    <th className={tableClasses.tableHeader + " w-1/12"}>Done</th>
                    <th className={tableClasses.tableHeader + " w-6/12 text-left px-2"}>Title</th>
                    <th className={tableClasses.tableHeader + " w-2/12"}>Note</th>
                    <th className={tableClasses.tableHeader + " w-3/12"}>Actions</th>
                </tr>
            </thead>
            <tbody className={tableClasses.tableBody}>
                {videos.map((video) => (
                    <React.Fragment key={video.id}>
                        <tr className={tableClasses.tableRow}>
                            <td className={tableClasses.tableCell + " text-center"} onClick={() => toggleDone(video.id, video.done)}>
                                <div className="flex justify-center items-center h-full">
                                    {video.done ? (
                                        <Check className={tableClasses.checkIcon} strokeWidth={3} />
                                    ) : (
                                        <Check className={tableClasses.checkIconBlack} strokeWidth={3} />
                                    )}
                                </div>
                            </td>
                            <td className={tableClasses.tableTitle}>
                                <a href={video.url} target="_blank" rel="noopener noreferrer" title={video.title}>
                                    {truncateTitle(video.title)}
                                </a>
                            </td>
                            <td className={tableClasses.tableCell}>
                                <div className="flex justify-center items-center h-full">
                                    {video.note && (
                                        <NotebookPen className={tableClasses.noteIcon} 
                                            strokeWidth={2}
                                            onClick={() => toggleNote(video.id)}
                                        />
                                    )}
                                </div>
                            </td>
                            <td className={tableClasses.tableCell}>
                                <div className="flex items-center justify-center space-x-2 h-full">
                                    <Edit
                                        className={tableClasses.editIcon}
                                        onClick={() => setSelectedVideo(video)}
                                    />
                                    <Trash2
                                        className={tableClasses.deleteIcon}
                                        onClick={() => deleteVideo(video.id)}
                                    />
                                </div>
                            </td>
                        </tr>
                        {expandedNoteId === video.id && (
                            <tr>
                                <td colSpan="4" className={tableClasses.tableCellExpanded}>{video.note}</td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );
};

export default VideoList;
