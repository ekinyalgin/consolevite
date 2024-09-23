const express = require('express');
const router = express.Router();
const excelController = require('../controllers/excelController');
const { authorize, isAdmin } = require('../middlewares/auth');

// Check that all these routes are using existing controller methods
router.get('/excel-files', authorize, excelController.getExcelFiles);
router.get('/check-excel/:domainName', authorize, excelController.checkExcelFile);
router.get('/content/:domainName', authorize, isAdmin, excelController.getExcelContent);
router.get('/download/:domainName', excelController.downloadExcel);
router.post('/download-multiple', authorize, isAdmin, excelController.bulkDownloadReports);
router.delete('/delete/:domainName', authorize, isAdmin, excelController.deleteExcelFile); // New route for deleting Excel file

module.exports = router;