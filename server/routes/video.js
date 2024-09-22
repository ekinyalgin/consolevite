const express = require('express');
const router = express.Router();
const { authorize, isAdmin } = require('../middlewares/auth');
const videoController = require('../controllers/videoController');

router.get('/', videoController.getVideos);
router.post('/', videoController.addVideo);
router.put('/:id', videoController.updateVideo);
router.delete('/:id', videoController.deleteVideo);

module.exports = router;
