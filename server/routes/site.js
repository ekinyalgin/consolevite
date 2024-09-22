const express = require('express');
const router = express.Router();
const siteController = require('../controllers/siteController');
const { authorize, isAdmin } = require('../middlewares/auth');

router.get('/', authorize, siteController.getAllSites);
router.post('/', authorize, isAdmin, siteController.createSite);
router.put('/:id', authorize, isAdmin, siteController.updateSite);
router.delete('/:id', authorize, isAdmin, siteController.deleteSite);

router.get('/languages', authorize, siteController.getLanguages);
router.post('/languages', authorize, isAdmin, siteController.createLanguage);
router.delete('/languages/:id', authorize, isAdmin, siteController.deleteLanguage);

router.get('/categories', authorize, siteController.getCategories);
router.post('/categories', authorize, isAdmin, siteController.createCategory);
router.delete('/categories/:id', authorize, isAdmin, siteController.deleteCategory);

router.post('/bulk-update', authorize, isAdmin, siteController.bulkUpdateSites);

module.exports = router;
