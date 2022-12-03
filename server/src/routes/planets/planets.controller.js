const { getAllPlanets } = require('../../models/planets.model')

function httpGetAllPlanets(req, res) {
    return res.status(200).json(getAllPlanets()) // пишем return, т.к. response не может быть переассайнен! Для предотвращения будущтих ошибок 
}

module.exports = {
    httpGetAllPlanets
}