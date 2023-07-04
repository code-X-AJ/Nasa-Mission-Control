const http = require('http');
require('dotenv').config();
const app = require('./app');
const {connectDB} = require('./services/mongo');

const planetModel = require('./models/planets.model');
const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer(){
    await connectDB();
    await planetModel.loadPlanets();
    server.listen(PORT,()=>{
        console.log(`Listening on PORT ${PORT}...`);
    });
};
startServer(); 