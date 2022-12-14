const launchesDatabase = require('./launches.mongo')
const planets = require('./planets.mongo')

const DEFAULT_FLIGHT_NUMBER = 100

function existsLaunchWithId(launchId) {
    return launches.has(launchId)
}

const launch = {
    flightNumber: 100,
    mission: "Kepler Exploration X",
    rocket: "Explorer IS1",
    launchDate: new Date("December 27, 2030"),
    target: "Kepler-442 b",
    customers: ["ZTM", "NASA"],
    upcoming: true,
    success: true,
};

async function getLatestFlightNumber() {
    const latestLaunch = await launchesDatabase
        .findOne()
        .sort('-flightNumber').flightNumber // встроенный метод MongoDB

    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER // если не найдено, начинаем с 100 создавать
    }

    return latestLaunch.flightNumber
}

async function getAllLaunches() {
    return await launchesDatabase.find({}, {
        '__v': 0,
        '_id': 0
    })
}

saveLaunch(launch)

async function saveLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target
    })
    if (!planet) {
        throw new Error('No matching planets found')
    }
    await launchesDatabase.updateOne(
        { flightNumber: launch.flightNumber },
        launch,
        { upsert: true },
    )
}

async function scheduleNewLaunch(launch) {
    const newFlightNumber = await getLatestFlightNumber() + 1

    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['Zero to Mastery', 'NASA'],
        flightNumber: newFlightNumber,
    })
    saveLaunch(newLaunch)
}

function abortLaunchById(launchId) {
    const aborted = launches.get(launchId)
    aborted.upcoming = false
    aborted.success = false
    return aborted
}

module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById
};