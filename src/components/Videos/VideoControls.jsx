import React from 'react';

const VideoControls = ({ fetchVideos, goToRandomVideo, videosLength, limit }) => {
  return (
    <div className="flex space-x-4 mt-4">
      {videosLength % limit === 0 && (
        <button
          onClick={fetchVideos}
          className="bg-transparent border border-gray-500 text-black text-xs px-4 font-semibold py-2 rounded hover:bg-gray-600 hover:text-white transition flex items-center"
        >
          Load More
        </button>
      )}

      <button
        onClick={goToRandomVideo}
        className="bg-transparent border border-gray-500 text-black text-xs px-4 font-semibold py-2 rounded hover:bg-gray-600 hover:text-white transition flex items-center"
      >
        Random Video
      </button>
    </div>
  );
};

export default VideoControls;
