const authService = require("../services/authService");

exports.showRegisterPage = (req, res) => {
    res.render("register");
};

exports.showLoginPage = (req, res) => {
    res.render("login");
};

exports.showForgotPasswordPage = (req, res) => {
    res.render("forgot-password");
};

exports.handleForgotPassword = (req, res) => {
    res.send("Forgot password feature coming soon");
};

// ================= REGISTER =================
exports.registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const existingUser = await authService.findUserByEmail(email);

        if (existingUser) {
            req.flash("error", "Email already exists");
            return res.redirect("/register");
        }

        await authService.createUser({ name, email, password, role });

        req.flash("success", "Registration successful! Please login.");
        res.redirect("/login");

    } catch (err) {
        console.log(err);
        res.send("Registration Error");
    }
};

// ================= LOGIN =================
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authService.verifyUserCredentials(email, password);
        if (!user) {
            req.flash("error", "Invalid email or password");
            return res.redirect("/login");
        }

        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        };

        if (user.role === "student") {
            return res.redirect("/student/dashboard");
        } else {
            return res.redirect("/recruiter/dashboard");
        }

    } catch (err) {
        console.log(err);
        res.send("Login Error");
    }
};

// ================= LOGOUT =================
exports.logoutUser = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
};
