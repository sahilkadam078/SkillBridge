const express = require("express");
const router = express.Router();

function isRecruiter(req, res, next) {
    if (!req.session.user || req.session.user.role !== "recruiter") {
        return res.redirect("/login");
    }
    next();
}

router.get("/dashboard", isRecruiter, (req, res) => {
    res.render("recruiter/dashboard");
});

module.exports = router;