function requireRole(role) {
    return (req, res, next) => {
        if (!req.session.user || req.session.user.role !== role) {
            return res.redirect("/login");
        }
        next();
    };
}

module.exports = {
    requireRole
};
