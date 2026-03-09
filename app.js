const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const csrf = require("csurf");

require("dotenv").config();

const homeRoutes = require("./routes/homeRoutes");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const recruiterRoutes = require("./routes/recruiterRoutes");

const app = express();
const isProduction = process.env.NODE_ENV === "production";
const sessionSecret = process.env.SESSION_SECRET;

if (!sessionSecret) {
    throw new Error("Missing required environment variable: SESSION_SECRET");
}


// ================= BODY PARSER =================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// ================= SESSION =================
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: isProduction
    }
}));

app.use(flash());
app.use(csrf());


// ================= GLOBAL LOCALS =================
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.user = req.session.user || null;
    res.locals.csrfToken = req.csrfToken();
    next();
});


// ================= VIEW ENGINE =================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(expressLayouts);
app.set("layout", "layouts/main");


// ================= STATIC FILES =================
app.use(express.static(path.join(__dirname, "public")));


// ================= ROUTES =================
app.use("/", homeRoutes);
app.use("/", authRoutes);
app.use("/student", studentRoutes);
app.use("/recruiter", recruiterRoutes);


// ================= SERVER =================
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// ================= CSRF ERROR HANDLER =================
app.use((err, req, res, next) => {
    if (err.code !== "EBADCSRFTOKEN") {
        return next(err);
    }

    req.flash("error", "Invalid or expired form token. Please try again.");
    res.redirect(req.get("Referrer") || "/");
});
