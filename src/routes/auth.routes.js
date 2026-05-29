const express = require('express');
const { loginController ,registerController} = require('../controllers/auth.controller');
const router = express.Router();
router.post('/register',registerController)
router.post('/login',loginController)

module.exports = router;  //this is auth routes file code
