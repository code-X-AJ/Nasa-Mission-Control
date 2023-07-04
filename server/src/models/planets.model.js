const fs = require('fs');
const path = require('path')
const csvParse = require('csv-parse');
const planets = require('./planets.mongo');

function isHabitable(planet) {
    return planet['koi_disposition'] === "CONFIRMED" && planet['koi_insol'] > 0.36 && planet["koi_insol"] < 1.11 && planet['koi_prad'] < 1.6;
}

async function loadPlanets(){
    return await new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data','003 kepler-data.csv'))
        .pipe(csvParse.parse({
            comment : '#',  
            columns: true
        }))
        .on('data', async(data)=>{
            if(isHabitable(data)){
                await savePlanet(data);
            }
        })
        .on("error", (err)=>{
            console.error(`Hey I am an error:- ${err}`);
            reject(err);
        })
        .on('end', async()=>{
            const countPlanets = (await getAllPlanets()).length;
            console.log(`We got ${countPlanets} Habitable planets, lets see how far we get!!!`);
            resolve();
        });
    });
}

async function getAllPlanets() {
    return await planets.find({},{
        "__v":0, "_id":0
    }); 
}

async function savePlanet(data) {
    try{
        await planets.updateOne({
            keplerName:data.kepler_name,
        },{
            keplerName:data.kepler_name,
        },{
            upsert:true
        });
    }catch(err){
        console.error(`Could not save the data : ${err}`)
    }
}

module.exports = {
    loadPlanets,
    getAllPlanets
};