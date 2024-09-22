const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');
const { authorize, isAdmin } = require('../middlewares/auth');

router.get('/:domainName', authorize, urlController.getUrlsForDomain);
router.post('/add-urls/:domainName', authorize, isAdmin, urlController.addUrlsToDomain);
router.put('/urls/:id/review', authorize, urlController.markUrlAsReviewed);
router.delete('/urls/:id', authorize, isAdmin, urlController.deleteUrl);

router.get('/:category/not-reviewed', authorize, urlController.getNotReviewedUrlsByCategory);
router.get('/domains/:category/not-reviewed', authorize, urlController.getRandomDomainsWithNotReviewedUrls);

module.exports = router;
