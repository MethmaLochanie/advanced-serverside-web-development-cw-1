const express = require("express");
const {
  register,
  login,
  validateToken,
} = require("../controllers/authController");
const { loginLimiter, registerLimiter } = require("../middleware/auth");
const { validations, validate } = require("../middleware/validator");
const router = express.Router();

router.post(
  "/register",
  registerLimiter,
  validate(validations.register),
  register
);
router.post("/login", loginLimiter, validate(validations.login), login);

module.exports = router;
