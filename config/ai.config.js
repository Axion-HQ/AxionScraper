import dotenv from "dotenv";
import chalk from "chalk";

import { OpenAI } from "openai";
import Groq from "groq-sdk";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OpenAI_API_KEY,
});

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const modelTypes = {
    GROQ_MODEL: "llama3-70b-8192",
    OPENAI_MODEL: "gpt-3.5-turbo",
}

const systemPrompt = {
    content: `
    You are an AI assistant specialized in processing and analyzing scraped data. Your role is to transform raw information into valuable, easily understandable, and informative content tailored to user queries. 
    
    Your outputs should include:
    - Concise summaries
    - Detailed explanations
    - Structured information extracted from unformatted or HTML-cluttered text

    Key responsibilities:
    - Clean and organize messy data
    - Provide clear, concise responses
    - Adapt your output based on data volume and complexity
    - Inform users if the data is invalid or unusable
    - Summarize large datasets to highlight key points
    - Offer in-depth explanations for smaller datasets
    - Ensure all information presented is relevant to the user's query

    Your goal is to make complex or disorganized information accessible and useful, always prioritizing clarity and relevance in your responses.`
}

const apiConfiguration = {
    model: "gpt-3.5-turbo",
    prompt: `
        You were not given any data to process, write a prompt telling the user that 
        the data was invalid and to try again.`,
    maxTokens: 150,
    temperature: 0,
    frequencyPenalty: 0,
    presencePenalty: 0,
}

const checkConfiguration = (configuration) => {
    if (!configuration.model) {
        console.log(`${chalk.black.bold.bgRed("[ ERROR ]")}: There was no model set, defined, or provided in configurations.`);
        throw new Error("Model is Empty!");
    }

    if (!configuration.prompt) {
        console.log(`${chalk.black.bold.bgRed("[ ERROR ]")}: There was no prompt set or defined in configurations.`);
        throw new Error("Prompt is Empty!");
    }
    
    if (!configuration.maxTokens) {
        console.log(`${chalk.black.bold.bgRed("[ ERROR ]")}: There was no max_tokens set or defined in configurations.`);
        throw new Error("Max Tokens is Empty!");
    }

    return configuration;
}

const determineModelType = (modelType) => modelTypes[modelType] || modelTypes.GROQ_MODEL;


const outputGeneratedResponse = async (data, configuration, model) => {
    if (!data) {
        console.log(`${chalk.black.bold.bgRed("[ ERROR ]")}: Data provided is empty or null or has not been properly defined.`);
        throw new Error("Data Provided is Empty!");
    }

    if(!model) {
        console.log(`${chalk.black.bold.bgRed("[ ERROR ]")}: Model provided is empty or null or has not been properly defined.`);
        throw new Error("Model is not Defined!");
    }

    if (!configuration) {
        configuration = apiConfiguration;
    }

    model = determineModelType(model);
    checkConfiguration(configuration);
    let response;

    try {
        if (model === modelTypes.GROQ_MODEL) {
            response = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: systemPrompt.content,
                    },
                    {
                        role: "user",
                        content: data,
                    }
                ],
                model: configuration.model,
            });

        } else if (model === modelTypes.OPENAI_MODEL) {
            response = await openai.chat.completions.create({
                model: configuration.model,
                messages: [
                    {
                        role: "system",
                        content: systemPrompt.content,
                    },
                    {
                        role: "user",
                        content: data,
                    }
                ],
                max_tokens: configuration.maxTokens || 150,
                temperature: configuration.temperature || 0,
                frequency_penalty: configuration.frequencyPenalty || 0,
                presence_penalty: configuration.presencePenalty || 0,
            });
        }

        if (response) {
            console.log(`${chalk.black.bold.bgGreen("[ SUCCESS ]")}: ${response.status} - Information Processed and Queried!`);

            return response.choices[0]?.message?.content || "";
        }

    } catch (error) {
        console.log(`${chalk.black.bold.bgRed("[ ERROR ]")}: ${error.message}`);
        throw new Error(error.message);

    }
}


export {
    modelTypes,
    outputGeneratedResponse,
    systemPrompt
}