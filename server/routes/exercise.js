// routes/exercise.js
const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');
const { authorize, isAdmin } = require('../middlewares/auth');

// Yetkilendirme ile route'ları koruma
router.get('/', authorize, isAdmin, exerciseController.getAllExercises);
router.get('/:id', authorize, isAdmin, exerciseController.getExerciseById);
router.post('/', authorize, isAdmin, exerciseController.createExercise);
router.put('/:id', authorize, isAdmin, exerciseController.updateExercise);
router.delete('/:id', authorize, isAdmin, exerciseController.deleteExercise);

module.exports = router;
