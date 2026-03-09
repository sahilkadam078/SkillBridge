const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const { requireRole } = require("../middleware/roleMiddleware");
const {
    validateStudentProfile,
    validateStudentApply,
    validateResetPassword
} = require("../middleware/validators");

const isStudent = requireRole("student");

router.get("/dashboard", isStudent, studentController.showDashboard);
router.post("/profile/save", isStudent, validateStudentProfile, studentController.saveProfile);
router.post("/apply/:id", isStudent, validateStudentApply, studentController.applyToInternship);
router.post("/reset-password", isStudent, validateResetPassword, studentController.resetPassword);

module.exports = router;
