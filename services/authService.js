const db = require("../config/db");
const bcrypt = require("bcrypt");

async function findUserByEmail(email) {
    const [rows] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );
    return rows[0] || null;
}

async function createUser({ name, email, password, role }) {
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, role]
    );
}

async function verifyUserCredentials(email, password) {
    const user = await findUserByEmail(email);

    if (!user) {
        return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
}

module.exports = {
    findUserByEmail,
    createUser,
    verifyUserCredentials
};
