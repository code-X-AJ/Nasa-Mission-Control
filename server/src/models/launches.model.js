const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

let DefaultFlightNumber = 100;

async function saveLaunch(launch) {
    const planet = await planets.findOne({
        keplerName : launch.target
    });
    if(!planet) {
        throw new Error('Target planet not exixts.');
    }
    await launchesDatabase.findOneAndUpdate({
        flightNumber : launch.flightNumber,
    },launch,{
        upsert:true
    });
};

async function getLatestFlight(params) {
    const  latestlaunch = await launchesDatabase
    .findOne()
    .sort("-flightNumber")

    if(!latestlaunch){
        return DefaultFlightNumber;
    }
    return latestlaunch.flightNumber;
}

async function scheduleNewLaunch(launch) {
    const newFlight = await getLatestFlight() + 1;
    const newLaunch = Object.assign(launch,{
        success : true,
        upcoming : true,
        customers : ['ufotable', 'mappa', 'A1 Animation'],
        flightNumber : newFlight
    });
    await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
    const aborted = await launchesDatabase.updateOne({
        flightNumber: launchId
    },{
        upcoming : false,
        success : false
    })
    // console.log(aborted);
    return aborted.acknowledged == true;
}

async function existsLaunchWithId(launchId) {
    return await launchesDatabase.findOne({
        flightNumber : launchId
    });
}

async function getAllLaunches() {
    return await launchesDatabase
        .find({},{"_id":0, "__v":0});
}

module.exports = {
    getAllLaunches,
    scheduleNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
}