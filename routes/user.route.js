const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');
const isAuth = require('../middleware/auth');



router.get('/availability', userController.getSeatAvailability);
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/book',  isAuth, userController.bookSeat);
router.get('/getAllbookings', isAuth, userController.FetchBookingDetails);


module.exports = router;