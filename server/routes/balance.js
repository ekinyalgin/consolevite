const express = require('express');
const router = express.Router();
const balanceController = require('../controllers/balanceController');
const { authorize } = require('../middlewares/auth');

router.post('/', authorize, balanceController.addBalance);
router.get('/', authorize, balanceController.getBalances);
router.put('/:id', authorize, balanceController.updateBalance);
router.delete('/:id', authorize, balanceController.deleteBalance);
router.post('/:id/decrease-installment', authorize, balanceController.decreaseInstallment);

module.exports = router;