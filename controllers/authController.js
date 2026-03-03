const db = require("../config/db");
const bcrypt = require("bcrypt");

// ================= REGISTER =================
exports.registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const [existing] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (existing.length > 0) {
            req.flash("error", "Email already exists");
            return res.redirect("/register");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
            [name, email, hashedPassword, role]
        );

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
        const [rows] = await db.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (rows.length === 0) {
            req.flash("error", "Invalid email or password");
            return res.redirect("/login");
        }

        const user = rows[0];

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
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