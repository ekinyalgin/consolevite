import React, { useState } from 'react';
import tableClasses from '../../utils/tableClasses';
import { Check, XCircle, NotebookPen, Edit, Trash2, Plus } from 'lucide-react';

const VideoList = ({ videos, fetchVideos, setSelectedVideo, showNotification }) => {
    const [expandedNoteId, setExpandedNoteId] = useState(null);
    const [togglingDoneId, setTogglingDoneId] = useState(null);

    const toggleDone = async (id, done) => {
        setTogglingDoneId(id);
    
        // Güncellenecek video nesnesini bul
        const videoToUpdate = videos.find(video => video.id === id);
    
        // Eğer video bulunamazsa işlem yapma
        if (!videoToUpdate) {
            showNotification('Video not found', 'error');
            return;
        }
    
        try {
            // Güncelleme verisi
            const updatedVideoData = {
                title: videoToUpdate.title,
                url: videoToUpdate.url,
                note: videoToUpdate.note,
                done: done ? 0 : 1, // Mevcut done değerini tersine çevir
            };
    
            // Güncelleme isteği gönder
            const response = await fetch(`${import.meta.env.VITE_API_URL}/videos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedVideoData),
            });
    
            if (response.ok) {
                fetchVideos();
                showNotification('Video updated successfully', 'success');
            } else {
                const errorData = await response.json();
                showNotification(`Failed to update video: ${errorData.error}`, 'error');
            }
        } catch (error) {
            showNotification('Failed to update video', 'error');
        } finally {
            setTogglingDoneId(null); // Animasyonun bitişi
        }
    };
    

    const deleteVideo = async (id) => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/videos/${id}`, {
                method: 'DELETE',
            });
            fetchVideos();
            showNotification('Video deleted successfully', 'success');
        } catch (error) {
            showNotification('Failed to delete video', 'error');
        }
    };

    const toggleNote = (id) => {
        setExpandedNoteId(expandedNoteId === id ? null : id);
    };

    return (
        <table className={tableClasses.table}>
            <thead className={tableClasses.tableHeader}>
                <tr>
                    <th className={tableClasses.tableHeader + " w-1/12"}>Done</th>
                    <th className={tableClasses.tableHeader + " w-5/12 text-left px-2"}>Title</th>
                    <th className={tableClasses.tableHeade + " w-1/12"}>Note</th>
                    <th className={tableClasses.tableHeade + " w-1/12"}>Edit</th>
                    <th className={tableClasses.tableHeade + " w-1/12"}>Delete</th>
                </tr>
            </thead>
            <tbody className={tableClasses.tableBody}>
                {videos.map((video) => (
                    <React.Fragment key={video.id}>
                        <tr className={tableClasses.tableRow}>
                            <td className={tableClasses.tableCell + " text-center"} onClick={() => toggleDone(video.id, video.done)}>
                                <div
                                    className={`transition-transform duration-300 ease-in-out ${
                                        togglingDoneId === video.id ? "scale-75" : "scale-100"
                                    }`}
                                >
                                    {video.done ? (
                                       <Check className={tableClasses.checkIcon} strokeWidth={3} />
                                    ) : (
                                        <Plus className={tableClasses.checkIcon} strokeWidth={3} />
                                    )}
                                </div>
                            </td>
                            <td className={tableClasses.tableTitle}>
                                <a href={video.url} target="_blank" rel="noopener noreferrer">
                                    {video.title}
                                </a>
                            </td>
                            <td className={tableClasses.tableCell}>
                                {video.note && (
                                    <NotebookPen className={tableClasses.noteIcon} 
                                        strokeWidth={2}
                                        onClick={() => toggleNote(video.id)}
                                    />
                                )}
                            </td>
                            <td className={tableClasses.tableCell}>
                                <Edit
                                    className={tableClasses.editIcon}
                                    onClick={() => setSelectedVideo(video)}
                                />
                            </td>
                            <td className={tableClasses.tableCell}>
                                <Trash2
                                    className={tableClasses.deleteIcon}
                                    onClick={() => deleteVideo(video.id)}
                                />
                            </td>
                        </tr>
                        {expandedNoteId === video.id && (
                            <tr>
                                <td colSpan="5" className={tableClasses.tableCellExpanded}>{video.note}</td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );
};

export default VideoList;
