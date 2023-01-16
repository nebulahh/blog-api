var express = require('express');
var router = express.Router();

const authController = require('../controllers/auth');

router.post('/signup', authController.postSignup);

router.post('/login', authController.postLogin);

router.get('/logout', authController.logout);

module.exports = router;
