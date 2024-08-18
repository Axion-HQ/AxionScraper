"use strict";

import express from "express";
import dotenv from "dotenv";
import chalk from "chalk";

// ./config
import { scrapeRequest, scrapeRequestFetch, axiosConfig } from "../config/brightdata.config.js";

// ./lib
import { sendStatus } from "../lib/response.tmpl.js";

dotenv.config();

const router = express.Router();

router.get("/v1/scrape:query?", async (request, response) => {
    const { url } = request.query; 

    if (!url) {
        sendStatus(response, 400, "Invalid URL. Please Try Again.");
    }

    try {
        const data = await scrapeRequest(url);
        response.json({ data });

    } catch (error) {
        console.log(`${chalk.black.bold.bgRed("[ ERROR ]")}: ${error.message}`);
        sendStatus(response, 600, "Internal Server Error Occurred. Please Try Again.");
    }
}); 

router.get("v1/scrape/output/excel:query?", (request, response) => {
    const { url, title, config } = request.query;

    if (!url) {
        sendStatus(response, 400, "Invalid URL. Please Try Again.");
    }

    if (!title) {
        sendStatus(response, 400, "Invalid Title, Please Try Again.");
    }

    // TODO: Complete Implementation
});

router.get("v1/scrape/output/csv:query?", (request, response) => {
    const { url, title, config } = request.query;  

    // TODO: Complete Implementation
});

router.get("v1/scrape/output/json:query?", (request, response) => {
    const { url, title, config } = request.query;

    // TODO: Complete Implementation
});

export {
    router
}