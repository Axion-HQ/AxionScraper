import mongoose from "mongoose";
import chalk from "chalk";
import dotenv from "dotenv";
import { ServerApiVersion } from "mongodb";

dotenv.config();
let connectionStatus = false;

const connectToDatabase = async () => {
    mongoose.set('strictQuery', true);

    if(!process.env.MONGO_URI) {
        console.log(`${chalk.black.bold.bgRed("[ ERROR ]")}: MONGO_URI is not defined in the .env file.`);
        return;
    }

    if (connectionStatus) {
        console.log(`${chalk.black.bold.bgGreen("[ SUCCESS ]")}: Connection to MongoDB is already established.`);
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        })

        connectionStatus = true;
        console.log(`${chalk.black.bold.bgGreen("[ SUCCESS ]")}: Connection to MongoDB Database established.`);

    } catch (error) {
        console.log(`${chalk.black.bold.bgRed("[ ERROR ]")}: ${error.message}`);
    }
}

export {
    connectToDatabase,
    connectionStatus
}