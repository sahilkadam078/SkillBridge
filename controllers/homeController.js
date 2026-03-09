const homeService = require("../services/homeService");

exports.renderHome = async (req, res) => {
    try {
        const internships = await homeService.getOpenVisibleInternships();
        res.render("home", { internships });
    } catch (error) {
        console.log(error);
        res.render("home", { internships: [] });
    }
};
