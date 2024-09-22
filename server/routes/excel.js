const express = require('express');
const router = express.Router();
const excelController = require('../controllers/excelController');
const { authorize, isAdmin } = require('../middlewares/auth');

router.get('/excel-files', authorize, excelController.getExcelFiles);
router.get('/excel-content/:domainName', authorize, excelController.getExcelContentByDomain);
router.get('/check-excel/:domainName', authorize, excelController.checkExcelFile);

router.get('/download/:domainName', authorize, isAdmin, excelController.downloadReport);
router.post('/download-multiple', authorize, isAdmin, excelController.bulkDownloadReports);

module.exports = router;
