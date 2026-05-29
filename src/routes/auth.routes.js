const express = require('express');
const router = express.Router();
router.post('/create-user',registerController)


module.exports = router;  //this is auth routes file code