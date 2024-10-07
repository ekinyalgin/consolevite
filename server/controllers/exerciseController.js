const Exercise = require('../models/exercise');


// Tüm egzersizleri getirme
exports.getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercise.findAll(); // Sequelize 'findAll' kullanıyoruz
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
    const exercise = await Exercise.findByPk(id); // Sequelize 'findByPk' kullanıyoruz
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }
    res.status(200).json(exercise);
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
    const newExercise = await Exercise.create({ title, duration, description, video_url }); // Sequelize 'create' kullanıyoruz
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
    const exercise = await Exercise.findByPk(id);
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    exercise.title = title;
    exercise.duration = duration;
    exercise.description = description;
    exercise.video_url = video_url;

    await exercise.save(); // Veritabanında güncelleme
    res.status(200).json(exercise);
  } catch (error) {
    console.error("Error updating exercise:", error);
    res.status(500).json({ message: 'Failed to update exercise' });
  }
};

// Egzersizi silme
exports.deleteExercise = async (req, res) => {
  const { id } = req.params;
  try {
    const exercise = await Exercise.findByPk(id);
    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    await exercise.destroy(); // Veritabanından silme
    res.status(200).json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    console.error("Error deleting exercise:", error);
    res.status(500).json({ message: 'Failed to delete exercise' });
  }
};
