const studentService = require("../services/studentService");

exports.showDashboard = async (req, res) => {
    const section = req.query.section || "jobs";
    const keyword = req.query.keyword || "";
    const userId = req.session.user.id;

    try {
        const data = await studentService.getDashboardData(userId, section, keyword);
        res.render("student/dashboard", data);
    } catch (error) {
        console.log(error);
        res.send("Something went wrong");
    }
};

exports.saveProfile = async (req, res) => {
    const userId = req.session.user.id;

    try {
        await studentService.upsertProfile(userId, req.body);
        req.flash("success", "Profile saved successfully");
        res.redirect("/student/dashboard?section=profile");
    } catch (error) {
        console.log(error);
        res.send("Profile save error");
    }
};

exports.applyToInternship = async (req, res) => {
    const internshipId = req.params.id;
    const studentId = req.session.user.id;

    try {
        await studentService.applyToInternship(studentId, internshipId);
        res.redirect("/student/dashboard?section=applied");
    } catch (error) {
        console.log(error);
        res.send("Application error");
    }
};

exports.resetPassword = async (req, res) => {
    const { currentPassword, password } = req.body;
    const userId = req.session.user.id;

    try {
        const result = await studentService.updatePassword(userId, currentPassword, password);

        if (!result.ok && result.reason === "invalid_current_password") {
            req.flash("error", "Current password incorrect");
            return res.redirect("/student/dashboard?section=reset");
        }

        if (!result.ok) {
            req.flash("error", "Unable to update password");
            return res.redirect("/student/dashboard?section=reset");
        }

        req.flash("success", "Password updated successfully");
        res.redirect("/student/dashboard?section=jobs");
    } catch (error) {
        console.log(error);
        res.send("Password update error");
    }
};
