const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt");

// ================= MIDDLEWARE =================
function isStudent(req, res, next) {
    if (!req.session.user || req.session.user.role !== "student") {
        return res.redirect("/login");
    }
    next();
}

// ================= STUDENT PANEL =================
router.get("/dashboard", isStudent, async (req, res) => {

    const section = req.query.section || "jobs";
    const keyword = req.query.keyword || "";
    const userId = req.session.user.id;

    let internships = [];
    let applications = [];
    let profile = null;

    try {

        // ================= OPENING JOBS =================
        if (section === "jobs") {

            let sql = "SELECT * FROM internships WHERE status='open'";
            let params = [];

            if (keyword) {
                sql += " AND (title LIKE ? OR required_skills LIKE ?)";
                params.push(`%${keyword}%`, `%${keyword}%`);
            }

            const [rows] = await db.query(sql, params);
            internships = rows;
        }

        // ================= APPLIED =================
        if (section === "applied") {

            const [rows] = await db.query(
                `SELECT i.*, a.status
                 FROM applications a
                 JOIN internships i ON a.internship_id = i.id
                 WHERE a.student_id = ? AND a.status='applied'`,
                [userId]
            );

            applications = rows;
        }

        // ================= APPROVED =================
        if (section === "approved") {

            const [rows] = await db.query(
                `SELECT i.*, a.status
                 FROM applications a
                 JOIN internships i ON a.internship_id = i.id
                 WHERE a.student_id = ? AND a.status='approved'`,
                [userId]
            );

            applications = rows;
        }

        // ================= CANCELLED =================
        if (section === "cancelled") {

            const [rows] = await db.query(
                `SELECT i.*, a.status
                 FROM applications a
                 JOIN internships i ON a.internship_id = i.id
                 WHERE a.student_id = ? AND a.status='cancelled'`,
                [userId]
            );

            applications = rows;
        }

        // ================= PROFILE FETCH =================
        if (section === "profile") {

            const [rows] = await db.query(
                "SELECT * FROM student_profiles WHERE user_id = ?",
                [userId]
            );

            if (rows.length > 0) {
                profile = rows[0];
            }
        }

        res.render("student/dashboard", {
            section,
            internships,
            applications,
            profile,
            keyword
        });

    } catch (error) {
        console.log(error);
        res.send("Something went wrong");
    }
});


// ================= SAVE / UPDATE PROFILE =================
router.post("/profile/save", isStudent, async (req, res) => {

    const userId = req.session.user.id;
    const { name, address, skills, github, linkedin } = req.body;

    try {

        const [existing] = await db.query(
            "SELECT * FROM student_profiles WHERE user_id = ?",
            [userId]
        );

        if (existing.length > 0) {

            await db.query(
                `UPDATE student_profiles
                 SET name=?, address=?, skills=?, github=?, linkedin=?
                 WHERE user_id=?`,
                [name, address, skills, github, linkedin, userId]
            );

        } else {

            await db.query(
                `INSERT INTO student_profiles
                 (user_id, name, address, skills, github, linkedin)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [userId, name, address, skills, github, linkedin]
            );

        }

        req.flash("success", "Profile saved successfully");
        res.redirect("/student/dashboard?section=profile");

    } catch (error) {
        console.log(error);
        res.send("Profile save error");
    }

});


// ================= APPLY =================
router.post("/apply/:id", isStudent, async (req, res) => {

    const internshipId = req.params.id;
    const studentId = req.session.user.id;

    try {

        await db.query(
            "INSERT IGNORE INTO applications (student_id, internship_id) VALUES (?, ?)",
            [studentId, internshipId]
        );

        res.redirect("/student/dashboard?section=applied");

    } catch (error) {
        console.log(error);
        res.send("Application error");
    }

});


// ================= RESET PASSWORD =================
router.post("/reset-password", isStudent, async (req, res) => {

    const { currentPassword, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        req.flash("error", "Passwords do not match");
        return res.redirect("/student/dashboard?section=reset");
    }

    try {

        const [rows] = await db.query(
            "SELECT password FROM users WHERE id = ?",
            [req.session.user.id]
        );

        const user = rows[0];

        const match = await bcrypt.compare(currentPassword, user.password);

        if (!match) {
            req.flash("error", "Current password incorrect");
            return res.redirect("/student/dashboard?section=reset");
        }

        const hashed = await bcrypt.hash(password, 10);

        await db.query(
            "UPDATE users SET password = ? WHERE id = ?",
            [hashed, req.session.user.id]
        );

        req.flash("success", "Password updated successfully");

        res.redirect("/student/dashboard?section=jobs");

    } catch (error) {
        console.log(error);
        res.send("Password update error");
    }

});

module.exports = router;