const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");

const db = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const recruiterRoutes = require("./routes/recruiterRoutes");

const app = express();

// ================= BODY PARSER =================
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ================= SESSION =================
app.use(session({
    secret: "skillbridge_secret",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

// ================= GLOBAL LOCALS =================
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.user = req.session.user || null;
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
app.use("/", authRoutes);
app.use("/student", studentRoutes);
app.use("/recruiter", recruiterRoutes);

// ================= HOME =================
app.get("/", async (req, res) => {

    try {

        const [internships] = await db.query(
            "SELECT * FROM internships WHERE status='open' LIMIT 3"
        );

        res.render("home", { internships });

    } catch (error) {

        console.log(error);

        res.render("home", { internships: [] });

    }

});

// ================= SERVER =================
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});