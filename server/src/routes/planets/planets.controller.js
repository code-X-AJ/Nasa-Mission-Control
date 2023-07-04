const { getAllPlanets } = require('../../models/planets.model');

async function httpGetAllPlanets(req,res) {
    return res.send(await getAllPlanets());
}

module.exports = {
    httpGetAllPlanets,
};