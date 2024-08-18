import dotenv from "dotenv";
import chalk from "chalk";

import { OpenAI } from "openai";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OpenAI_API_KEY,
})

const openaiSystemPrompt = {
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
        console.log(`${chalk.black.bold.bgRed("[ ERROR ]")}: Model is Empty.`);
        throw new Error("Model is Empty!");
    }

    if (!configuration.prompt) {
        console.log(`${chalk.black.bold.bgRed("[ ERROR ]")}: Prompt is Empty.`);
        throw new Error("Prompt is Empty!");
    }
    
    if (!configuration.maxTokens) {
        console.log(`${chalk.black.bold.bgRed("[ ERROR ]")}: Max Tokens is Empty.`);
        throw new Error("Max Tokens is Empty!");
    }

    return configuration;
}

const outputGeneratedResponse = async (data, configuration = apiConfiguration) => {
    if (!data) {
        console.log(`${chalk.black.bold.bgRed("[ ERROR ]")}: Data is Empty.`);
        throw new Error("Data Provided is Empty!");
    }

    checkConfiguration(configuration);

    try {
        const response = await openai.chat.completions.create({
            model: configuration.model,
            messages: [
                {
                    role: "system",
                    content: openaiSystemPrompt.content,
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
        })

        if (response) {
            console.log(`${chalk.black.bold.bgGreen("[ SUCCESS ]")}: ${response.status} - Information Processed and Queried!`);

            return response.choices[0].message.content;
            // return response.choices[0].message;
        }

    } catch (error) {
        console.log(`${chalk.black.bold.bgRed("[ ERROR ]")}: ${error.message}`);
        throw new Error(error.message);

    }
}


export {
    outputGeneratedResponse,
    openaiSystemPrompt,
    openai
}