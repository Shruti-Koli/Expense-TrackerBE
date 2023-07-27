const express = require('express');
const premiumController = require('../controllers/premiumController');
const authenticate = require('../middleware/authentication');

const router = express.Router();

router.get('/showLeaderBoard', authenticate.authenticate, premiumController.getUserLeaderBoard);
router.get('/getfile',authenticate.authenticate,premiumController.getFile);
router.get('/getoldreports',authenticate.authenticate,premiumController.getPrevFiles);

module.exports = router;