import * as config from "./config/config.js";
import dotenv from "dotenv";
import chalk from "chalk";

// ./config 
import * as db from "./config/db.js";
import app from "./config/config.js";
import { sendStatus } from "./lib/response.tmpl.js";

dotenv.config();

app.use("/", (request, response) => {
    try {
        db.connectToDatabase();
        sendStatus(response, 200, "Welcome to AxionScraper API.");

    } catch(error) {
        console.log(`${chalk.black.bold.bgRed("[ ERROR ]")}: ${error.message}`);
        sendStatus(response, 404, "Something Went Wrong, Please Try Again.");
    }
})

app.get("*", (request, response) => {
    sendStatus(response, 404, "Invalid Path. Please Try Again.");
});


app.listen(app.get("port"), () => {
    console.log(`${chalk.black.bold.bgGreen("[ OPEN ]")}: Server is listening on PORT ${app.get("port")}`);
    console.log(`${chalk.black.bold.bgGreen("[ OPEN ]")}: Localhost: http://localhost:${app.get("port")}`);
})