import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectDB() {
    
    try {
        await mongoose.connect(process.env.DB_CONNECTION_URI);

    } catch (error) {
       throw new Error(error) 
    }
}