const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);

router.get("/logout", authController.logoutUser);

module.exports = router;