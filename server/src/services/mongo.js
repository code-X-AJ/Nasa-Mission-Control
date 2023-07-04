const mongoose = require("mongoose");

console.log(process.env.MONGO_URL);
const MONGO_URL = process.env.MONGO_URL;

const connectDB = async() => {
    try {
        mongoose.connect(MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log(`MongoDB Connected`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

async function mongoDisconnect(){
    await mongoose.disconnect();
}

module.exports = {
    connectDB,
    mongoDisconnect
}