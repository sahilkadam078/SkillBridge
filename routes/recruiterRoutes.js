const express = require("express");
const router = express.Router();
const db = require("../config/db");

// ================= MIDDLEWARE =================
function isRecruiter(req, res, next) {
    if (!req.session.user || req.session.user.role !== "recruiter") {
        return res.redirect("/login");
    }
    next();
}

// ================= DASHBOARD =================
router.get("/dashboard", isRecruiter, async (req, res) => {
    const recruiterId = req.session.user.id;

    try {
        const [internships] = await db.query(
            "SELECT * FROM internships WHERE recruiter_id = ?",
            [recruiterId]
        );

        res.render("recruiter/dashboard", { internships });

    } catch (error) {
        console.log(error);
        res.send("Recruiter dashboard error");
    }
});

// ================= ADD INTERNSHIP =================
router.post("/add", isRecruiter, async (req, res) => {
    const recruiterId = req.session.user.id;
    const { title, description, required_skills } = req.body;

    try {
        await db.query(
            `INSERT INTO internships (recruiter_id, title, description, required_skills)
             VALUES (?, ?, ?, ?)`,
            [recruiterId, title, description, required_skills]
        );

        res.redirect("/recruiter/dashboard");

    } catch (error) {
        console.log(error);
        res.send("Add internship error");
    }
});

// ================= VIEW APPLICANTS =================
router.get("/applicants/:id", isRecruiter, async (req, res) => {
    const internshipId = req.params.id;

    try {
        const [applicants] = await db.query(
            `SELECT a.id AS application_id,
                    u.name,
                    u.email,
                    a.status
             FROM applications a
             JOIN users u ON a.student_id = u.id
             WHERE a.internship_id = ?`,
            [internshipId]
        );

        res.render("recruiter/applicants", { applicants });

    } catch (error) {
        console.log(error);
        res.send("Applicants fetch error");
    }
});

// ================= UPDATE APPLICATION STATUS =================
router.post("/application/:id", isRecruiter, async (req, res) => {
    const applicationId = req.params.id;
    const { status } = req.body;

    try {
        await db.query(
            "UPDATE applications SET status = ? WHERE id = ?",
            [status, applicationId]
        );

        res.redirect("back");

    } catch (error) {
        console.log(error);
        res.send("Status update error");
    }
});

module.exports = router;