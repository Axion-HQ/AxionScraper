import path from "path";
import * as fs from "fs";
import express from "express";
import cors from "cors";

// TODO: if CommonJS, Use this Code.
// const path = require("path");
// const fs = require("fs");
// const express = require("express");
// const cors = require("cors");

import { router } from "../routes/routes.js";

// NOTE: Scraping Lib
import puppeteer from "puppeteer";

const app = express();
app.set("port", process.env.PORT || 3000)

// NOTE: Setup Express Configuration
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(path.dirname(""), "../node_modules")));

app.use('/api', router);


// NOTE: Setup Puppeteer Pre-Configuration

// NOTE: Setup Puppeteer Configuration

export default app;