import mongoose from 'mongoose' 
import config from './config.js'
export default async function connectDB() {
    await mongoose.connect(config.Mongo_URL, {
    })
    console.log("Database connected successfully")
}
