const { ProductionVideo } = require('../models');
const fs = require('fs');

exports.uploadVideo = async (req, res) => {
  try {
    const { filename, path } = req.file;
    const video = await ProductionVideo.create({ filename, filepath: path });
    res.status(201).json({ id: video.id, filename, path });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading video' });
  }
};

exports.getVideos = async (req, res) => {
  try {
    const videos = await ProductionVideo.findAll();
    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching videos' });
  }
};

exports.downloadVideo = async (req, res) => {
  try {
    const video = await ProductionVideo.findByPk(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.download(video.filepath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error downloading video' });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const video = await ProductionVideo.findByPk(req.params.id);
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    // Delete the file
    fs.unlinkSync(video.filepath);
    
    // Delete the database record
    await video.destroy();
    
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting video' });
  }
};
