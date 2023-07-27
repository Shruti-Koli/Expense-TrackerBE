const express = require('express');
const purcchaseController = require('../controllers/purchase');
const authenticate = require('../middleware/authentication');

const router = express.Router();


router.get('/premiummembership', authenticate.authenticate, purcchaseController.purchasePremium);
router.post('/updatetransactionstatus', authenticate.authenticate, purcchaseController.updateTransactionStatus);
router.post('/updateTransactionFailedStatus', authenticate.authenticate, purcchaseController.updateFailedTransactionStatus);



module.exports = router;