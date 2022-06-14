const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/', authController.logout);
module.exports = router;