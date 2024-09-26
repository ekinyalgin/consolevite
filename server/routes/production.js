const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const productionController = require('../controllers/productionController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/videos');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });
router.post('/upload', upload.single('video'), productionController.uploadVideo);
router.get('/', productionController.getVideos);
router.get('/:id/download', productionController.downloadVideo);
router.delete('/:id', productionController.deleteVideo);

module.exports = router;