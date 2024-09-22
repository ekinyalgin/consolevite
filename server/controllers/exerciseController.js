// controllers/exerciseController.js
const db = require('../config/db'); 

// Tüm egzersizleri getirme
exports.getAllExercises = async (req, res) => {
  try {
    const [exercises] = await db.query('SELECT * FROM exercises'); // Tüm egzersizleri çek
    res.status(200).json(exercises);
  } catch (error) {
    console.error("Error fetching exercises:", error);
    res.status(500).json({ message: 'Failed to fetch exercises' });
  }
};

// Tek bir egzersizi ID ile getirme
exports.getExerciseById = async (req, res) => {
  const { id } = req.params;
  try {
    const [exercise] = await db.query('SELECT * FROM exercises WHERE id = ?', [id]); // ID'ye göre çek
    if (exercise.length === 0) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    res.status(200).json(exercise[0]);
  } catch (error) {
    console.error("Error fetching exercise:", error);
    res.status(500).json({ message: 'Failed to fetch exercise' });
  }
};

// Yeni bir egzersiz oluşturma
exports.createExercise = async (req, res) => {
  const { title, duration, description, video_url } = req.body;
  
  if (!title || !duration) {
    return res.status(400).json({ message: 'Title and duration are required' });
  }

  try {
    const [result] = await db.query('INSERT INTO exercises (title, duration, description, video_url) VALUES (?, ?, ?, ?)', 
      [title, duration, description, video_url]);
    
    const newExercise = { id: result.insertId, title, duration, description, video_url };
    res.status(201).json(newExercise);
  } catch (error) {
    console.error("Error creating exercise:", error);
    res.status(500).json({ message: 'Failed to create exercise' });
  }
};

// Egzersizi güncelleme
exports.updateExercise = async (req, res) => {
  const { id } = req.params;
  const { title, duration, description, video_url } = req.body;

  if (!title || !duration) {
    return res.status(400).json({ message: 'Title and duration are required' });
  }

  try {
    const [result] = await db.query(
      'UPDATE exercises SET title = ?, duration = ?, description = ?, video_url = ? WHERE id = ?', 
      [title, duration, description, video_url, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    res.status(200).json({ id, title, duration, description, video_url });
  } catch (error) {
    console.error("Error updating exercise:", error);
    res.status(500).json({ message: 'Failed to update exercise' });
  }
};

// Egzersizi silme
exports.deleteExercise = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query('DELETE FROM exercises WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    res.status(200).json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    console.error("Error deleting exercise:", error);
    res.status(500).json({ message: 'Failed to delete exercise' });
  }
};
