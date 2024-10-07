import React from 'react';

const SiteListActions = ({ onBulkDownload, onAddUrls, isDownloading, isAddingUrls }) => {
  return (
    <div className="mt-4 flex items-center space-x-4">
      <button 
        onClick={onBulkDownload}
        className={`bg-transparent border border-gray-500 text-black text-xs px-4 font-semibold py-2 rounded hover:bg-gray-600 hover:text-white transition ${isDownloading ? 'opacity-50 cursor-not-allowed' : 'bg-white'}`}
        disabled={isDownloading}
      >
        {isDownloading ? 'Downloading...' : 'Download Report'}
      </button>
    
      <button 
        onClick={onAddUrls}
        className={`bg-transparent border border-gray-500 text-black text-xs px-4 font-semibold py-2 rounded hover:bg-gray-600 hover:text-white transition ${isAddingUrls ? 'opacity-50 cursor-not-allowed' : 'bg-white'}`}
        disabled={isAddingUrls}
      >
        {isAddingUrls ? 'Adding URLs...' : 'Add URLs'}
      </button>
    </div>
  );
};

export default SiteListActions;