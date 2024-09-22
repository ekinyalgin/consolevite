const express = require('express');
const router = express.Router();
const videoController = require('../controllers/videoController');
const { authorize, isAdmin } = require('../middlewares/auth');

router.get('/', authorize, isAdmin, videoController.getVideos);
router.post('/',authorize, isAdmin, videoController.addVideo);
router.put('/:id', authorize, isAdmin, videoController.updateVideo);
router.delete('/:id', authorize, isAdmin, videoController.deleteVideo);

module.exports = router;
