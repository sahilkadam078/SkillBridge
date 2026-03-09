const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const {
    validateRegister,
    validateLogin,
    validateForgotPassword
} = require("../middleware/validators");

// ================= REGISTER PAGE =================
router.get("/register", authController.showRegisterPage);

// ================= LOGIN PAGE =================
router.get("/login", authController.showLoginPage);

// ================= REGISTER USER =================
router.post("/register", validateRegister, authController.registerUser);

// ================= LOGIN USER =================
router.post("/login", validateLogin, authController.loginUser);

// ================= LOGOUT =================
router.get("/logout", authController.logoutUser);

// ================= FORGET PASSWORD PAGE =================
router.get("/forgot-password", authController.showForgotPasswordPage);

// ================= HANDLE FORGET PASSWORD =================
router.post("/forgot-password", validateForgotPassword, authController.handleForgotPassword);

module.exports = router;
