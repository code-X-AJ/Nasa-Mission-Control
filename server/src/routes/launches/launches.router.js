const express = require('express');
const {
    httpGetAllLaunches,
    HttpAddNewLaunch,
    httpAbortLaunch,
} = require('./launches.controller')

const launchesRouter = express.Router();

launchesRouter.get('/', httpGetAllLaunches);
launchesRouter.post('/', HttpAddNewLaunch);
launchesRouter.delete('/:id', httpAbortLaunch);

module.exports = launchesRouter; 