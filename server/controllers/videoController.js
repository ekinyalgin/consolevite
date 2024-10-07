const Video = require('../models/video'); 
const { Op, Sequelize } = require('sequelize');

// Tüm videoları getirme
exports.getVideos = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10; // Varsayılan limit
  const offset = parseInt(req.query.offset) || 0; // Varsayılan offset

  try {
    const videos = await Video.findAll({
      limit: limit,
      offset: offset,
      order: [
        ['done', 'DESC'],
        ['id', 'DESC']
      ]
    });
    res.status(200).json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
};

// Yeni bir video ekleme
exports.addVideo = async (req, res) => {
  const { title, url, note } = req.body;

  try {
    const newVideo = await Video.create({
      title,
      url,
      note,
      done: 0, // Varsayılan olarak tamamlanmamış
      created_at: new Date() // Şu anki zamanı kullan
    });
    res.status(201).json(newVideo);
  } catch (error) {
    console.error('Error adding video:', error);
    res.status(500).json({ error: 'Failed to add video' });
  }
};

// Mevcut videoyu güncelleme
exports.updateVideo = async (req, res) => {
  const { id } = req.params;
  const { title, url, note, done } = req.body;

  try {
    const video = await Video.findByPk(id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    video.title = title;
    video.url = url;
    video.note = note;
    video.done = done;

    await video.save();
    res.status(200).json(video);
  } catch (error) {
    console.error('Error updating video:', error);
    res.status(500).json({ error: 'Failed to update video' });
  }
};

// Videoyu silme
exports.deleteVideo = async (req, res) => {
  const { id } = req.params;

  try {
    const video = await Video.findByPk(id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    await video.destroy();
    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
};
