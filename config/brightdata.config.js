"use strict";

import dotenv from "dotenv";
import axios from "axios";
import chalk from "chalk";
import * as cheerio from "cheerio";
import fetch from "node-fetch";
import { error } from "console";

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
const scrapeRequest = async (url, config = axiosConfig) => {
	if (!url) {
		console.log(
			`${chalk.black.bold.bgRed("[ ERROR ]")}: Invalid URL,  or URL is Empty.`
		);
		throw new Error("Invalid URL, or URL is Empty.");
	}

	try {
		const response = await axios.get(url, config);
		console.log(
			`${chalk.black.bold.bgGreen("[ SUCCESS ]")}: ${response.status}`
		);

		const $ = cheerio.load(response.data); 
		$('script, style, nav, footer, .ads, .sidebar').remove();

		const content = $('article, h1, h2, h3, p').text().replace(/\s\s+/g, ' ').trim();
		return content;

	} catch (error) {
		console.log(`${chalk.black.bold.bgRed("[ ERROR ]")}: ${error.message}`);
		throw new Error(error.message);

	}
};

// FIXME: Check If this Function Works!
const scrapeRequestFetch = (url, config = axiosConfig) => {
	if (!url) {
		console.log(
			`${chalk.black.bold.bgRed("[ ERROR ]")}: Invalid URL,  or URL is Empty.`
		);
		throw new Error("Invalid URL, or URL is Empty.");
	}

	try {
		fetch(url, config)
			.then((response) => {
				console.log(
					`${chalk.black.bold.bgGreen("[ SUCCESS ]")}: ${response.status}`
				);
				const $ = cheerio.load(response.data);
				return $.html(); // TODO: Configure to be More Specific!
			})
			.catch((error) => {
				console.log(`${chalk.black.bold.bgRed("[ ERROR ]")}: ${error.message}`);
				throw new Error(error.message);

			});
	} catch (error) {
		console.log(`${chalk.black.bold.bgRed("[ ERROR ]")}: ${error.message}`);
		throw new Error(error.message);

	}
};

export { brightDataConfig, axiosConfig, scrapeRequest, scrapeRequestFetch };
