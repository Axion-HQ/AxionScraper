"use strict";

import dotenv from "dotenv";
import axios from "axios";
import chalk from "chalk";
import * as cheerio from "cheerio";

dotenv.config();

const brightDataConfig = {
	host: process.env.BRIGHTDATA_PROXY_HOST,
	username: process.env.BRIGHTDATA_PROXY_USERNAME,
	password: process.env.BRIGTHDATA_PROXY_PASSWORD,
	port: 22225,
	session_id: 1000000 + Math.random() || 0,
};

const axiosConfig = {
	auth: {
		username: `${brightDataConfig.username}-session-${brightDataConfig.session_id}`,
		password: brightDataConfig.password,
	},
	host: `brd.superproxy.io`,
	port: brightDataConfig.port,
	rejectUnauthorized: false,
};

// FIXME: Check If this Function Works!
const scrapeRequest = (url, config) => {
	let requestResponse = null; // TODO: Use this to store data, and return. 

	if (!url) return;
    if (!config || config === null) {
        config = axiosConfig;
    } 

	return new Promise((resolve, reject) => {
		axios
			.get(url, config)
			.then((response) => {
				resolve;
				console.log(
					`${chalk.black.bold.bgGreen("[ SUCCESS ]")}: ${response.status}`
				);
				console.log(response.data);
			})
			.catch((error) => {
				console.log(`${chalk.black.bold.bgRed("[ ERROR ]")}: ${error.message}`);
			});
	});
};

// FIXME: Check If this Function Works!
const scrapeRequestFetch = (url, config) => {
	if (!url) return;
	if (!config || config === null) {
		config = axiosConfig;
	}

	return new Promise((resolve, reject) => {
		fetch(url, config)
			.then((response) => {
				resolve;
				console.log(
					`${chalk.black.bold.bgGreen("[ SUCCESS ]")}: ${response.status}`
				);
				console.log(response.data);
			})
			.catch((error) => {
				console.log(`${chalk.black.bold.bgRed("[ ERROR ]")}: ${error.message}`);
			});
	});
};

export { brightDataConfig, scrapeRequest, scrapeRequestFetch };
