const express = require('express');
const { verifyKey } = require('../middleware/verifyKey');
const adminController = require('../controllers/admin.controller');
const router = express.Router();


router.post('/create-train', verifyKey, adminController.addNewTrain);
router.put('/update-seats/:id', apiKeyMiddleware.verifyApiKey, adminController.updateTrainSeats);

module.exports = router;