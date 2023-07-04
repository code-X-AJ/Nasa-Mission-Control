const {
    getAllLaunches,
    existsLaunchWithId,
    abortLaunchById,
    scheduleNewLaunch,

} = require('../../models/launches.model');

async function httpGetAllLaunches(req,res) {
    return res.send(await getAllLaunches())
}

async function HttpAddNewLaunch(req,res) {
    const launch = req.body;
    if(!launch.mission ||!launch.rocket ||!launch.target ||!launch.launchDate){
        return res.status(400).json({
            error : "Mission required data is invalid..."
        })
    }
    launch.launchDate = new Date(launch.launchDate);
    if(isNaN(launch.launchDate)){
        return res.status(400).json({
            "error" : 'Invalid launch date.'
        });
    }
    await scheduleNewLaunch(launch);
    return res.status(201).json(launch);
}

async function httpAbortLaunch(req,res) {
    const launchId = Number(req.params.id);
    const existLaunch = await existsLaunchWithId(launchId);
    if(!existLaunch){
        return res.status(404).json({
            error: 'launch not found',
        });
    }
    const aborted = await abortLaunchById(launchId);
    console.log(aborted);
    if(!aborted){
        return res.status(400).json({
            error : "launch was not aborted!!!"
        });
    }
    return res.status(200).json({
        ok : true
    });
}


module.exports = {
    httpGetAllLaunches,
    HttpAddNewLaunch,
    httpAbortLaunch,
};