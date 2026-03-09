const recruiterService = require("../services/recruiterService");

exports.showCompanyProfile = async (req, res) => {
    const userId = req.session.user.id;

    try {
        const profile = await recruiterService.getCompanyProfile(userId);
        res.render("recruiter/company-profile", { profile });
    } catch (error) {
        console.log(error);
        res.send("Profile load error");
    }
};

exports.saveCompanyProfile = async (req, res) => {
    const userId = req.session.user.id;

    try {
        await recruiterService.upsertCompanyProfile(userId, req.body);
        req.flash("success", "Company profile saved");
        res.redirect("/recruiter/company-profile");
    } catch (error) {
        console.log(error);
        res.send("Profile save error");
    }
};

exports.showDashboard = async (req, res) => {
    const section = req.query.section || "my";
    const recruiterId = req.session.user.id;
    const selectedRole = req.query.role || "";

    try {
        const data = await recruiterService.getDashboardData(recruiterId, section, selectedRole);
        res.render("recruiter/dashboard", data);
    } catch (error) {
        console.log(error);
        res.send("Dashboard error");
    }
};

exports.addInternship = async (req, res) => {
    const recruiterId = req.session.user.id;

    try {
        await recruiterService.createInternship(recruiterId, req.body);
        req.flash("success", "Internship added successfully");
        res.redirect("/recruiter/dashboard?section=my");
    } catch (error) {
        console.log(error);
        res.send("Internship add error");
    }
};

exports.showEditInternship = async (req, res) => {
    const internshipId = req.params.id;
    const recruiterId = req.session.user.id;

    try {
        const internship = await recruiterService.getInternshipByIdForRecruiter(internshipId, recruiterId);
        if (!internship) {
            req.flash("error", "Internship not found or unauthorized");
            return res.redirect("/recruiter/dashboard?section=my");
        }

        res.render("recruiter/edit-internship", { internship });
    } catch (error) {
        console.log(error);
        res.send("Internship load error");
    }
};

exports.updateInternship = async (req, res) => {
    const internshipId = req.params.id;
    const recruiterId = req.session.user.id;

    try {
        const updated = await recruiterService.updateInternshipForRecruiter(internshipId, recruiterId, req.body);
        if (!updated) {
            req.flash("error", "Internship not found or unauthorized");
            return res.redirect("/recruiter/dashboard?section=my");
        }

        req.flash("success", "Internship updated successfully");
        res.redirect("/recruiter/dashboard?section=my");
    } catch (error) {
        console.log(error);
        res.send("Internship update error");
    }
};

exports.toggleInternshipVisibility = async (req, res) => {
    const internshipId = req.params.id;
    const recruiterId = req.session.user.id;

    try {
        const nextVisibility = await recruiterService.toggleInternshipVisibility(internshipId, recruiterId);
        if (!nextVisibility) {
            req.flash("error", "Internship not found or unauthorized");
            return res.redirect("/recruiter/dashboard?section=my");
        }

        const action = nextVisibility === "active" ? "activated" : "deactivated";
        req.flash("success", `Internship ${action} successfully`);
        res.redirect("/recruiter/dashboard?section=my");
    } catch (error) {
        console.log(error);
        res.send("Visibility update error");
    }
};

exports.showApplicants = async (req, res) => {
    const internshipId = req.params.id;
    const recruiterId = req.session.user.id;

    try {
        const applicants = await recruiterService.getApplicantsForInternship(internshipId, recruiterId);
        if (!applicants) {
            req.flash("error", "You are not authorized to view these applicants");
            return res.redirect("/recruiter/dashboard?section=my");
        }

        res.render("recruiter/applicants", { applicants });
    } catch (error) {
        console.log(error);
        res.send("Applicants fetch error");
    }
};

exports.updateApplicationStatus = async (req, res) => {
    const applicationId = req.params.id;
    const recruiterId = req.session.user.id;
    const { status } = req.body;

    try {
        const updated = await recruiterService.updateApplicationStatus(applicationId, recruiterId, status);
        if (!updated) {
            req.flash("error", "You are not authorized to update this application");
            return res.redirect("/recruiter/dashboard?section=applications");
        }

        res.redirect("back");
    } catch (error) {
        console.log(error);
        res.send("Status update error");
    }
};
