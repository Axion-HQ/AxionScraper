import * as config from "./config/config.js";
import dotenv from "dotenv";
import chalk from "chalk";

// ./config 
import * as brightdata from "./config/brightdata.config.js";
import * as db from "./config/db.js";
import app from "./config/config.js";

dotenv.config();

app.use()

app.use('/', (request, response) => {
    try {
        db.connectToDatabase();

    } catch(error) {
        console.log(`${chalk.black.bold.bgRed("[ ERROR ]")}: ${error.message}`);

    }
})

app.listen(app.get("port"), () => {
    console.log(`${chalk.black.bold.bgGreen("[ OPEN ]")}: Server is listening on PORT ${app.get("port")}`);
    console.log(`${chalk.black.bold.bgGreen("[ OPEN ]")}: Localhost: http://localhost:${app.get("port")}`);
})