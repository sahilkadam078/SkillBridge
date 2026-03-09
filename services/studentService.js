const db = require("../config/db");
const bcrypt = require("bcrypt");

async function getDashboardData(userId, section, keyword) {
    let internships = [];
    let applications = [];
    let profile = null;

    if (section === "jobs") {
        let sql = "SELECT * FROM internships WHERE status='open'";
        const params = [];

        if (keyword) {
            sql += " AND (title LIKE ? OR required_skills LIKE ?)";
            params.push(`%${keyword}%`, `%${keyword}%`);
        }

        const [rows] = await db.query(sql, params);
        internships = rows;
    }

    if (section === "applied" || section === "approved" || section === "cancelled") {
        const [rows] = await db.query(
            `SELECT i.*, a.status
             FROM applications a
             JOIN internships i ON a.internship_id = i.id
             WHERE a.student_id = ? AND a.status = ?`,
            [userId, section]
        );
        applications = rows;
    }

    if (section === "profile") {
        const [rows] = await db.query(
            "SELECT * FROM student_profiles WHERE user_id = ?",
            [userId]
        );
        profile = rows[0] || null;
    }

    return {
        section,
        internships,
        applications,
        profile,
        keyword
    };
}

async function upsertProfile(userId, profileData) {
    const { name, address, skills, github, linkedin } = profileData;

    const [existing] = await db.query(
        "SELECT id FROM student_profiles WHERE user_id = ?",
        [userId]
    );

    if (existing.length > 0) {
        await db.query(
            `UPDATE student_profiles
             SET name = ?, address = ?, skills = ?, github = ?, linkedin = ?
             WHERE user_id = ?`,
            [name, address, skills, github, linkedin, userId]
        );
        return;
    }

    await db.query(
        `INSERT INTO student_profiles
         (user_id, name, address, skills, github, linkedin)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, name, address, skills, github, linkedin]
    );
}

async function applyToInternship(studentId, internshipId) {
    await db.query(
        "INSERT IGNORE INTO applications (student_id, internship_id) VALUES (?, ?)",
        [studentId, internshipId]
    );
}

async function updatePassword(userId, currentPassword, newPassword) {
    const [rows] = await db.query(
        "SELECT password FROM users WHERE id = ?",
        [userId]
    );

    const user = rows[0];
    if (!user) {
        return { ok: false, reason: "not_found" };
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
        return { ok: false, reason: "invalid_current_password" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query(
        "UPDATE users SET password = ? WHERE id = ?",
        [hashedPassword, userId]
    );

    return { ok: true };
}

module.exports = {
    getDashboardData,
    upsertProfile,
    applyToInternship,
    updatePassword
};
