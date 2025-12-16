import mongoose from "mongoose"; 
import dotenv from "dotenv"
dotenv.config()

async function dbconnect() {
    try {
        let uri=process.env.DBURI
         await mongoose.connect(uri);
         console.log("db connect");
    } catch (error) {
        console.log(error);
        
    }
    
}

dbconnect()