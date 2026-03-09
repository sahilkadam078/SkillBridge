const db = require("../config/db");

async function getCompanyProfile(userId) {
    const [rows] = await db.query(
        "SELECT * FROM recruiter_profiles WHERE user_id = ?",
        [userId]
    );

    return rows[0] || null;
}

async function upsertCompanyProfile(userId, profileData) {
    const {
        company_name,
        company_website,
        company_location,
        company_description
    } = profileData;

    const [existing] = await db.query(
        "SELECT id FROM recruiter_profiles WHERE user_id = ?",
        [userId]
    );

    if (existing.length > 0) {
        await db.query(
            `UPDATE recruiter_profiles
             SET company_name = ?, company_website = ?, company_location = ?, company_description = ?
             WHERE user_id = ?`,
            [company_name, company_website, company_location, company_description, userId]
        );
        return;
    }

    await db.query(
        `INSERT INTO recruiter_profiles
         (user_id, company_name, company_website, company_location, company_description)
         VALUES (?, ?, ?, ?, ?)`,
        [userId, company_name, company_website, company_location, company_description]
    );
}

async function getDashboardData(recruiterId, section, selectedRole) {
    const data = {
        section,
        internships: [],
        applications: [],
        roles: [],
        selectedRole
    };

    if (section === "my") {
        const [rows] = await db.query(
            "SELECT * FROM internships WHERE recruiter_id = ?",
            [recruiterId]
        );
        data.internships = rows;
    }

    if (section === "applications") {
        const [roleRows] = await db.query(
            "SELECT id, title FROM internships WHERE recruiter_id = ?",
            [recruiterId]
        );
        data.roles = roleRows;

        let query = `
            SELECT 
                a.id,
                u.name,
                u.email,
                i.title,
                a.status
            FROM applications a
            JOIN users u ON a.student_id = u.id
            JOIN internships i ON a.internship_id = i.id
            WHERE i.recruiter_id = ?
        `;
        const params = [recruiterId];

        if (selectedRole) {
            query += " AND i.id = ?";
            params.push(selectedRole);
        }

        const [appRows] = await db.query(query, params);
        data.applications = appRows;
    }

    return data;
}

async function createInternship(recruiterId, internshipData) {
    const { title, description, required_skills, min_experience, visibility } = internshipData;
    const allowedVisibility = new Set(["active", "inactive"]);
    const safeVisibility = allowedVisibility.has(visibility) ? visibility : "active";

    await db.query(
        `INSERT INTO internships
         (recruiter_id, title, description, required_skills, min_experience, visibility, status)
         VALUES (?, ?, ?, ?, ?, ?, 'open')`,
        [recruiterId, title, description, required_skills, min_experience || null, safeVisibility]
    );
}

async function getInternshipByIdForRecruiter(internshipId, recruiterId) {
    const [rows] = await db.query(
        "SELECT * FROM internships WHERE id = ? AND recruiter_id = ?",
        [internshipId, recruiterId]
    );

    return rows[0] || null;
}

async function updateInternshipForRecruiter(internshipId, recruiterId, internshipData) {
    const { title, description, required_skills, min_experience } = internshipData;

    const [result] = await db.query(
        `UPDATE internships
         SET title = ?, description = ?, required_skills = ?, min_experience = ?
         WHERE id = ? AND recruiter_id = ?`,
        [title, description, required_skills, min_experience, internshipId, recruiterId]
    );

    return result.affectedRows > 0;
}

async function toggleInternshipVisibility(internshipId, recruiterId) {
    const [rows] = await db.query(
        "SELECT visibility FROM internships WHERE id = ? AND recruiter_id = ?",
        [internshipId, recruiterId]
    );

    if (rows.length === 0) {
        return null;
    }

    const currentVisibility = rows[0].visibility;
    const nextVisibility = currentVisibility === "active" ? "inactive" : "active";

    await db.query(
        "UPDATE internships SET visibility = ? WHERE id = ? AND recruiter_id = ?",
        [nextVisibility, internshipId, recruiterId]
    );

    return nextVisibility;
}

async function getApplicantsForInternship(internshipId, recruiterId) {
    const internship = await getInternshipByIdForRecruiter(internshipId, recruiterId);
    if (!internship) {
        return null;
    }

    const [applicants] = await db.query(
        `SELECT a.id AS application_id, u.name, u.email, a.status
         FROM applications a
         JOIN users u ON a.student_id = u.id
         JOIN internships i ON a.internship_id = i.id
         WHERE a.internship_id = ? AND i.recruiter_id = ?`,
        [internshipId, recruiterId]
    );

    return applicants;
}

async function updateApplicationStatus(applicationId, recruiterId, status) {
    const [ownedApplication] = await db.query(
        `SELECT a.id
         FROM applications a
         JOIN internships i ON a.internship_id = i.id
         WHERE a.id = ? AND i.recruiter_id = ?`,
        [applicationId, recruiterId]
    );

    if (ownedApplication.length === 0) {
        return false;
    }

    await db.query(
        "UPDATE applications SET status = ? WHERE id = ?",
        [status, applicationId]
    );

    return true;
}

module.exports = {
    getCompanyProfile,
    upsertCompanyProfile,
    getDashboardData,
    createInternship,
    getInternshipByIdForRecruiter,
    updateInternshipForRecruiter,
    toggleInternshipVisibility,
    getApplicantsForInternship,
    updateApplicationStatus
};
