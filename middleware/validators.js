const { body, param, validationResult } = require("express-validator");

const urlOptions = {
    protocols: ["http", "https"],
    require_protocol: true
};

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    req.flash("error", errors.array().map((e) => e.msg).join(", "));
    res.redirect(req.get("Referrer") || "/");
};

const validateRegister = [
    body("name")
        .trim()
        .isLength({ min: 2, max: 80 })
        .withMessage("Name must be between 2 and 80 characters"),
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail(),
    body("password")
        .isLength({ min: 8, max: 64 })
        .withMessage("Password must be between 8 and 64 characters"),
    body("role")
        .isIn(["student", "recruiter"])
        .withMessage("Invalid user role"),
    handleValidationErrors
];

const validateLogin = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail(),
    body("password")
        .notEmpty()
        .withMessage("Password is required"),
    handleValidationErrors
];

const validateForgotPassword = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email")
        .normalizeEmail(),
    handleValidationErrors
];

const validateStudentProfile = [
    body("name")
        .trim()
        .isLength({ min: 2, max: 80 })
        .withMessage("Name must be between 2 and 80 characters"),
    body("address")
        .optional({ values: "falsy" })
        .trim()
        .isLength({ max: 255 })
        .withMessage("Address cannot exceed 255 characters"),
    body("skills")
        .optional({ values: "falsy" })
        .trim()
        .isLength({ max: 255 })
        .withMessage("Skills cannot exceed 255 characters"),
    body("github")
        .optional({ values: "falsy" })
        .trim()
        .isURL(urlOptions)
        .withMessage("GitHub URL must start with http:// or https://"),
    body("linkedin")
        .optional({ values: "falsy" })
        .trim()
        .isURL(urlOptions)
        .withMessage("LinkedIn URL must start with http:// or https://"),
    handleValidationErrors
];

const validateStudentApply = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid internship id"),
    handleValidationErrors
];

const validateResetPassword = [
    body("currentPassword")
        .notEmpty()
        .withMessage("Current password is required"),
    body("password")
        .isLength({ min: 8, max: 64 })
        .withMessage("New password must be between 8 and 64 characters"),
    body("confirmPassword")
        .custom((value, { req }) => value === req.body.password)
        .withMessage("Passwords do not match"),
    handleValidationErrors
];

const validateRecruiterProfile = [
    body("company_name")
        .trim()
        .isLength({ min: 2, max: 120 })
        .withMessage("Company name must be between 2 and 120 characters"),
    body("company_website")
        .optional({ values: "falsy" })
        .trim()
        .isURL(urlOptions)
        .withMessage("Company website must start with http:// or https://"),
    body("company_location")
        .optional({ values: "falsy" })
        .trim()
        .isLength({ max: 120 })
        .withMessage("Location cannot exceed 120 characters"),
    body("company_description")
        .optional({ values: "falsy" })
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Description cannot exceed 1000 characters"),
    handleValidationErrors
];

const validateRecruiterInternshipCreate = [
    body("title")
        .trim()
        .isLength({ min: 2, max: 150 })
        .withMessage("Role title must be between 2 and 150 characters"),
    body("description")
        .optional({ values: "falsy" })
        .trim()
        .isLength({ max: 2000 })
        .withMessage("Description cannot exceed 2000 characters"),
    body("required_skills")
        .optional({ values: "falsy" })
        .trim()
        .isLength({ max: 255 })
        .withMessage("Required skills cannot exceed 255 characters"),
    body("min_experience")
        .optional({ values: "falsy" })
        .trim()
        .isLength({ max: 80 })
        .withMessage("Minimum experience cannot exceed 80 characters"),
    body("visibility")
        .isIn(["active", "inactive"])
        .withMessage("Invalid visibility value"),
    handleValidationErrors
];

const validateRecruiterInternshipEdit = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid internship id"),
    body("title")
        .trim()
        .isLength({ min: 2, max: 150 })
        .withMessage("Role title must be between 2 and 150 characters"),
    body("description")
        .optional({ values: "falsy" })
        .trim()
        .isLength({ max: 2000 })
        .withMessage("Description cannot exceed 2000 characters"),
    body("required_skills")
        .optional({ values: "falsy" })
        .trim()
        .isLength({ max: 255 })
        .withMessage("Required skills cannot exceed 255 characters"),
    body("min_experience")
        .optional({ values: "falsy" })
        .trim()
        .isLength({ max: 80 })
        .withMessage("Minimum experience cannot exceed 80 characters"),
    handleValidationErrors
];

const validateInternshipIdParam = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid internship id"),
    handleValidationErrors
];

const validateApplicationStatusUpdate = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid application id"),
    body("status")
        .isIn(["applied", "approved", "cancelled"])
        .withMessage("Invalid application status"),
    handleValidationErrors
];

module.exports = {
    validateRegister,
    validateLogin,
    validateForgotPassword,
    validateStudentProfile,
    validateStudentApply,
    validateResetPassword,
    validateRecruiterProfile,
    validateRecruiterInternshipCreate,
    validateRecruiterInternshipEdit,
    validateInternshipIdParam,
    validateApplicationStatusUpdate
};
