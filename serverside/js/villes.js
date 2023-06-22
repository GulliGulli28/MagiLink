const{ Ville } = require("./db.js");

// Get all cities
async function get_cities() {
    return await Ville.findAll({attributes : ['ville_id','ville_nom_reel']});
    }

module.exports = {get_cities};

