const db = require("../config/db");

async function getOpenVisibleInternships() {
    const [internships] = await db.query(
        "SELECT * FROM internships WHERE status='open' AND visibility='active' ORDER BY id DESC"
    );

    return internships;
}

module.exports = {
    getOpenVisibleInternships
};
