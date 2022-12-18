const launchesDatabase = require('./launches.mongo')
const planets = require('./planets.mongo')

const DEFAULT_FLIGHT_NUMBER = 100

async function existsLaunchWithId(launchId) {
    return await launchesDatabase.findOne({
        flightNumber: launchId
    })
}

async function getLatestFlightNumber() {
    const latestLaunch = await launchesDatabase
        .findOne()
        .sort('-flightNumber') // встроенный метод MongoDB

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER // если не найдено, начинаем с 100 создавать
    }

    return latestLaunch.flightNumber + 1
}

async function getAllLaunches() {
    return await launchesDatabase.find({}, {
        '__v': 0,
        '_id': 0
    })
}

async function saveLaunch(launch) {

    const planet = await planets.findOne({
        keplerName: launch.target
    })
    if (!planet) {
        throw new Error('No matching planets found')
    }
    await launchesDatabase.findOneAndUpdate(
        { flightNumber: launch.flightNumber },
        launch,
        { upsert: true },
    )
}

async function scheduleNewLaunch(launch) {
    const newFlightNumber = await getLatestFlightNumber()

    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['Zero to Mastery', 'NASA'],
        flightNumber: newFlightNumber,
    })
    saveLaunch(newLaunch)
}

async function abortLaunchById(launchId) {
    const aborted = await launchesDatabase.updateOne({
        flightNumber: launchId
    }, {
        upcoming: false,
        success: false
    })
    return aborted.modifiedCount === 1 // modifiedCount приходит по дефолту от mongoDB
}

module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById
};