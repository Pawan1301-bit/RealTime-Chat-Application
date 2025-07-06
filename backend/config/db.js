//here i willl connect my database to expresss
const mongoose = require('mongoose');

const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(process.env.URL_MONGODB);
        console.log('connected to mongodb', conn.connection.host);
    } catch (error) {
        console.log(`mongodb connection failed ${error.message}`);
        process.exit();
    }
}

module.exports =  connectDB;