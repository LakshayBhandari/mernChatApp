import mongoose from "mongoose";

const ConnectToMongoDB = async () =>{
    try {
        
        await mongoose.connect(process.env.MONGO_DB_URI)
        console.log("Connected to MongoDB");
    } catch (error) {
        console.log("Error connect to Mongo DB",error.message)
    }
}

export default ConnectToMongoDB;