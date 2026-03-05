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

// ================= COMPANY PROFILE =================
router.get("/company-profile", isRecruiter, async (req, res) => {

    const userId = req.session.user.id;

    try {

        const [rows] = await db.query(
            "SELECT * FROM recruiter_profiles WHERE user_id = ?",
            [userId]
        );

        let profile = null;

        if(rows.length > 0){
            profile = rows[0];
        }

        res.render("recruiter/company-profile", { profile });

    } catch (error) {
        console.log(error);
        res.send("Profile load error");
    }

});


// ================= SAVE / UPDATE COMPANY PROFILE =================
router.post("/company-profile/save", isRecruiter, async (req,res)=>{

    const userId = req.session.user.id;

    const {
        company_name,
        company_website,
        company_location,
        company_description
    } = req.body;

    try {

        const [existing] = await db.query(
            "SELECT * FROM recruiter_profiles WHERE user_id = ?",
            [userId]
        );

        if(existing.length > 0){

            await db.query(
                `UPDATE recruiter_profiles
                 SET company_name=?, company_website=?, company_location=?, company_description=?
                 WHERE user_id=?`,
                [company_name, company_website, company_location, company_description, userId]
            );

        } else {

            await db.query(
                `INSERT INTO recruiter_profiles
                (user_id, company_name, company_website, company_location, company_description)
                VALUES (?, ?, ?, ?, ?)`,
                [userId, company_name, company_website, company_location, company_description]
            );

        }

        req.flash("success","Company profile saved");
        res.redirect("/recruiter/company-profile");

    } catch(error){
        console.log(error);
        res.send("Profile save error");
    }

});


// ================= DASHBOARD =================
router.get("/dashboard", isRecruiter, async (req, res) => {

    const section = req.query.section || "my";
    const recruiterId = req.session.user.id;

    let internships = [];

    try {

        if(section === "my"){

            const [rows] = await db.query(
                "SELECT * FROM internships WHERE recruiter_id = ?",
                [recruiterId]
            );

            internships = rows;
        }

        res.render("recruiter/dashboard", {
            section,
            internships
        });

    } catch(error){
        console.log(error);
        res.send("Dashboard error");
    }

});


// ================= ADD INTERNSHIP =================
router.post("/add", isRecruiter, async (req, res) => {

    const recruiterId = req.session.user.id;

    const {
        title,
        description,
        required_skills
    } = req.body;

    try {

        await db.query(
            `INSERT INTO internships
            (recruiter_id, title, description, required_skills, status)
            VALUES (?, ?, ?, ?, 'open')`,
            [recruiterId, title, description, required_skills]
        );

        req.flash("success","Internship added successfully");

        res.redirect("/recruiter/dashboard?section=my");

    } catch(error){
        console.log(error);
        res.send("Internship add error");
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