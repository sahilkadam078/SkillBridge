const express = require("express");
const router = express.Router();
const recruiterController = require("../controllers/recruiterController");
const { requireRole } = require("../middleware/roleMiddleware");
const {
    validateRecruiterProfile,
    validateRecruiterInternshipCreate,
    validateRecruiterInternshipEdit,
    validateInternshipIdParam,
    validateApplicationStatusUpdate
} = require("../middleware/validators");

const isRecruiter = requireRole("recruiter");

router.get("/company-profile", isRecruiter, recruiterController.showCompanyProfile);
router.post("/company-profile/save", isRecruiter, validateRecruiterProfile, recruiterController.saveCompanyProfile);

router.get("/dashboard", isRecruiter, recruiterController.showDashboard);
router.post("/add", isRecruiter, validateRecruiterInternshipCreate, recruiterController.addInternship);

router.get("/edit/:id", isRecruiter, validateInternshipIdParam, recruiterController.showEditInternship);
router.post("/edit/:id", isRecruiter, validateRecruiterInternshipEdit, recruiterController.updateInternship);
router.post("/toggle/:id", isRecruiter, validateInternshipIdParam, recruiterController.toggleInternshipVisibility);

router.get("/applicants/:id", isRecruiter, validateInternshipIdParam, recruiterController.showApplicants);
router.post("/application/:id", isRecruiter, validateApplicationStatusUpdate, recruiterController.updateApplicationStatus);

module.exports = router;
