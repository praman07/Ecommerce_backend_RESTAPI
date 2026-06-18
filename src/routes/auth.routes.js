const express = require("express");
const {
  loginController,
  registerController,
  logoutController,
  refreshTokenController,
} = require("../controllers/auth.controller");
const router = express.Router();


router.post("/register", registerController);
router.post("/login", loginController);
router.post("/logout", logoutController);
router.post("/refresh-token", refreshTokenController);

module.exports = router; //this is auth routes file code
