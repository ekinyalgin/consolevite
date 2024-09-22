const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');
const { authorize, isAdmin } = require('../middlewares/auth');

router.get('/:domainName', authorize, urlController.getUrlsForDomain);
router.post('/add-urls/:domainName', authorize, isAdmin, urlController.addUrlsToDomain);
router.put('/:id/review', authorize, urlController.markUrlAsReviewed); // Bu satırı ekleyin veya düzeltin
router.delete('/:id', authorize, isAdmin, urlController.deleteUrl);

router.get('/:category/not-reviewed', authorize, urlController.getNotReviewedUrlsByCategory);
router.get('/domains/:category/not-reviewed', authorize, urlController.getRandomDomainsWithNotReviewedUrls);
router.get('/status/:domainName', authorize, urlController.getUrlsStatusForDomain);

router.get('/:domainName/reviewed', authorize, urlController.getReviewedUrls);
router.get('/:domainName/not-reviewed', authorize, urlController.getNotReviewedUrls);

module.exports = router;
