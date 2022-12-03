const { getAllLaunches } = require('../../models/launches.model')

function httpGetAllLaunches(req, res) {
    return res.status(200).json(getAllLaunches()) // пишем return, т.к. response не может быть переассайнен! Для предотвращения будущтих ошибок 
}

module.exports = {
    httpGetAllLaunches
}