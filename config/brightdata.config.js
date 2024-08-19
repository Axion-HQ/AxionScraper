"use strict";

import dotenv from "dotenv";
import axios from "axios";
import chalk from "chalk";
import * as cheerio from "cheerio";
import fetch from "node-fetch";

import { modelTypes, outputGeneratedResponse } from "./ai.config.js";

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
			`${chalk.black.bold.bgRed("[ ERROR ]")}: Invalid URL, or URL provided is empty.`
		);
		throw new Error("Invalid URL, or URL provided is empty.");
	}

	try {
		const response = await axios.get(url, config);
		console.log(`${chalk.black.bold.bgGreen("[ SUCCESS ]")}: ${response.status} - Information processed and scraped!`);
		const $ = cheerio.load(response.data); 

		// NOTE: Remove ANY Extra or Unnecessary Content from the HTML content.
		$("*").each((idx, element) => {
			$(element).text($(element).text().trim());
		});
		
		const unfilteredHTMLContent = $.html().replace(/(\r\n|\n|\r|\t)/gm, "").trim(); // TODO: Configure to be More Specific!
		const filteredHTMLContent = await outputGeneratedResponse(unfilteredHTMLContent, {
			model: modelTypes.GROQ_MODEL,
			prompt: unfilteredHTMLContent,
			maxTokens: 100, 
			temperature: 1.2,
		}, modelTypes.GROQ_MODEL);

		return filteredHTMLContent;

	} catch (error) {
		console.log(`${chalk.black.bold.bgRed("[ ERROR ]")}: ${error.message}`);
		throw new Error(error.message);

	}
};

// FIXME: Check If this Function Works!
const scrapeRequestFetch = async (url, config = axiosConfig) => {
	if (!url) {
		console.log(
			`${chalk.black.bold.bgRed("[ ERROR ]")}: Invalid URL, or URL provided is empty.`
		);
		throw new Error("Invalid URL, or URL provided is empty.");
	}

	try {
		fetch(url, config)
			.then((response) => {
				console.log(
					`${chalk.black.bold.bgGreen("[ SUCCESS ]")}: ${response.status}`
				);
				const $ = cheerio.load(response.data); 
		
				const unfilteredHTMLContent = $.html().replace(/(\r\n|\n|\r|\t)/gm, "").trim(); // TODO: Configure to be More Specific!
				// const filteredHTMLContent = outputGeneratedResponse(unfilteredHTMLContent);

				return unfilteredHTMLContent;

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
