const db = require('../config/db');
const fs = require('fs');

exports.uploadVideo = async (req, res) => {
  try {
    const { filename, path } = req.file;
    const [result] = await db.query(
      'INSERT INTO production_videos (filename, filepath) VALUES (?, ?)',
      [filename, path]
    );
    res.status(201).json({ id: result.insertId, filename, path });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading video' });
  }
};

exports.getVideos = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM production_videos');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching videos' });
  }
};

exports.downloadVideo = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM production_videos WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Video not found' });
    }
    const video = rows[0];
    res.download(video.filepath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error downloading video' });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM production_videos WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Video not found' });
    }
    const video = rows[0];
    
    // Dosyayı sil
    fs.unlinkSync(video.filepath);
    
    // Veritabanından kaydı sil
    await db.query('DELETE FROM production_videos WHERE id = ?', [req.params.id]);
    
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting video' });
  }
};
