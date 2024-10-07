const API_URL = import.meta.env.VITE_API_URL; // .env dosyasındaki API URL'si

// Videoları listeleme fonksiyonu
export const fetchVideos = async (offset = 0, limit = 10) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/videos?limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch videos');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching videos:', error);
    throw error;
  }
};

// Video ekleme veya güncelleme fonksiyonu
export const saveVideo = async (videoData) => {
  try {
    const token = localStorage.getItem('token');
    const method = videoData.id ? 'PUT' : 'POST';
    const url = videoData.id ? `${API_URL}/videos/${videoData.id}` : `${API_URL}/videos`;

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(videoData),
    });

    if (!response.ok) {
      throw new Error('Failed to save video');
    }

    const savedVideo = await response.json();
    return savedVideo;
  } catch (error) {
    console.error('Error saving video:', error);
    throw error;
  }
};

// Video silme fonksiyonu
export const deleteVideo = async (id) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/videos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete video');
    }

    return true;
  } catch (error) {
    console.error('Error deleting video:', error);
    throw error;
  }
};
