const express = require("express");
const router = express.Router();
const db = require("../config/db");

// middleware
function isStudent(req, res, next) {
    if (!req.session.user || req.session.user.role !== "student") {
        return res.redirect("/login");
    }
    next();
}

router.get("/dashboard", isStudent, async (req, res) => {
    const section = req.query.section || "dashboard";
    const userId = req.session.user.id;

    let profile = null;

    if (section === "profile") {
        const [rows] = await db.query(
            "SELECT * FROM student_profiles WHERE user_id = ?",
            [userId]
        );
        profile = rows[0] || null;
    }

    res.render("student/dashboard", {
        section,
        profile
    });
});

router.post("/profile/save", isStudent, async (req, res) => {
    const userId = req.session.user.id;

    const {
        name,
        address,
        bio,
        skills,
        experience_role,
        experience_company,
        github,
        linkedin
    } = req.body;

    const skillsString = Array.isArray(skills)
        ? skills.join(",")
        : skills || "";

    const [existing] = await db.query(
        "SELECT id FROM student_profiles WHERE user_id = ?",
        [userId]
    );

    if (existing.length > 0) {
        await db.query(
            `UPDATE student_profiles 
             SET name=?, address=?, bio=?, skills=?, 
                 experience_role=?, experience_company=?, 
                 github=?, linkedin=? 
             WHERE user_id=?`,
            [
                name,
                address,
                bio,
                skillsString,
                experience_role,
                experience_company,
                github,
                linkedin,
                userId
            ]
        );
    } else {
        await db.query(
            `INSERT INTO student_profiles 
             (user_id, name, address, bio, skills, 
              experience_role, experience_company, 
              github, linkedin) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId,
                name,
                address,
                bio,
                skillsString,
                experience_role,
                experience_company,
                github,
                linkedin
            ]
        );
    }

    req.flash("success", "Profile saved successfully");
    res.redirect("/student/dashboard?section=profile");
});

module.exports = router;