import React, { useState } from 'react';
import TableComponent from '../common/TableComponent'; // Ortak tablo bileşeni
import { Check, StickyNote  } from 'lucide-react';

const VideoList = ({ videos, setSelectedVideo, onDelete, toggleDone }) => {
  const [expandedNoteId, setExpandedNoteId] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  // Tamamlandı durumunu değiştirme
  const handleDoneToggle = (id, done) => {
    toggleDone(id, done);
  };

  // Not alanını genişletme/gizleme
  const toggleNote = (id) => {
    setExpandedNoteId(expandedNoteId === id ? null : id);
  };

  // Başlık kısaltma (çok uzun başlıkları daraltır)
  const truncateTitle = (title, maxLength = 60) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  // Tablo sütunlarını tanımlıyoruz
  const columns = [
    { 
      key: 'done', 
      label: 'Done', 
      className: 'text-center w-1/12',
      render: (_, item) => (
        <div className="w-full cursor-pointer">
          <Check 
            className={`mx-auto text-center w-4 h-4 ${item.done ? 'text-green-500' : 'text-gray-300 hover:text-green-700 transition'}`}
            strokeWidth={3} 
            onClick={() => handleDoneToggle(item.id, item.done)} 
          />
        </div>
      )
    },
    { 
      key: 'title', 
      label: 'Title',
      className: 'text-left w-8/12',
      render: (value, item) => (
        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-left font-semibold">
          {truncateTitle(value)}
        </a>
      ),
    },
    { 
      key: 'note', 
      label: 'Note',
      className: 'text-center w-1/12',
      render: (value, item) => (
        value && (
          <StickyNote  
            className="w-4 h-4 text-gray-500 hover:text-gray-700 mx-auto cursor-pointer" 
            onClick={() => toggleNote(item.id)} 
          />
        )
      )
    },
  ];

  return (
    <TableComponent
      columns={columns}
      data={videos}
      keyField="id"
      onEdit={setSelectedVideo}
      onDelete={onDelete}
      selectable={false}
      selectedItems={selectedItems}
      onSelectChange={setSelectedItems}
      expandedRows={expandedNoteId ? [expandedNoteId] : []}
      expandedContent={(item) => item.note}
    />
  );
};

export default VideoList;
