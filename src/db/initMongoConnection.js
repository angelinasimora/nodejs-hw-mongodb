import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

export const initMongoConnection = async () => {
    const { MONGODB_URL, MONGODB_USER, MONGODB_PASSWORD, MONGODB_DB } = process.env;

    const connectionString = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority&appName=Cluster0`;

    try {
        await mongoose.connect(connectionString);
        console.log("Mongo connection successfully established!");
    } catch (error) {
        console.log(error.message);
        throw error;
    }
};
