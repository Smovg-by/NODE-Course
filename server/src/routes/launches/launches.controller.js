const { getAllLaunches, addNewLaunch, abortLaunchById, existsLaunchWithId } = require('../../models/launches.model')

function httpGetAllLaunches(req, res) {
    return res.status(200).json(getAllLaunches()) // пишем return, т.к. response не может быть переассайнен! Для предотвращения будущтих ошибок 
}

function httpAddNewLaunch(req, res) {
    const launch = req.body

    if ( // проверяем наличи всех полей
        !launch.mission ||
        !launch.rocket ||
        !launch.launchDate ||
        !launch.target
    ) {
        return res.status(400).json(
            { error: 'Missing required launch property' }
        );
    }

    launch.launchDate = new Date(launch.launchDate)
    // проверяем, чтобы дата была числом после парса 
    if (isNaN(launch.launchDate)) {
        return res.status(400).json(
            { error: 'Invalid launch date' }
        );
    }
    addNewLaunch(launch)
    return res.status(201).json(launch)
}

function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id)

    if (!existsLaunchWithId(launchId)) {
        return res.status(404).json(
            { error: 'Launch not found' }
        );
    }

    const aborted = abortLaunchById(launchId)
    return res.status(201).json(aborted)
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}