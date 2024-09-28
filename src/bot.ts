import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { AzureOpenAI } from 'openai';
import { CodeAssistant } from './code-assistant';
import { ChatInterface } from './chat-interface';
import { REQUEST_START, USER_INPUT, RECEIVE_RESPONSE, RESPONSE_COMPLETE, REQUEST_ERROR } from './constants';
import { FileProcessor } from './file-processor';

const endpoint = process.env['AZURE_OPENAI_ENDPOINT'] || '<endpoint>'; // Retrieve Azure OpenAI endpoint from environment variables or use a default placeholder.
const apiKey = process.env['AZURE_OPENAI_API_KEY'] || '<api key>'; // Retrieve Azure OpenAI API key from environment variables or use a default placeholder.
const apiVersion = '2024-02-15-preview'; // Set the API version to use.
const deployment = 'openai-gpt-4o-deployment'; // Define the deployment name for the OpenAI model.

(async () => {
  try {
    // Check if a directory path is provided as an argument when running the script.
    const basePath = process.argv[2];
    if (!basePath) {
      throw new Error('Please provide a directory path as an argument.');
    }
    const stats = fs.statSync(basePath);
    if (!stats.isDirectory()) {
      throw new Error('Provided path is not a directory.');
    }
    const codePath = path.resolve(basePath);

    // Process files to get the code content in Markdown format.
    const fileProcessor = new FileProcessor();
    const codeContext = fileProcessor.processFiles(codePath, '**/*.ts');

    // Initialize the CodeAssistant
    const openai = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });
    const assistant = new CodeAssistant(openai, codeContext);

    // Initialize the ChatInterface
    const chat = new ChatInterface();

    // Synchronize events between CodeAssistant and ChatInterface.
    chat.on(USER_INPUT, (question) => {
      assistant.emit(USER_INPUT, question); // Forward user input to the assistant
    });

    assistant.on(REQUEST_START, () => {
      chat.writeResponse('Answer: \n'); // Indicate that the assistant is generating an answer
    });

    assistant.on(RECEIVE_RESPONSE, (chunk) => {
      chat.writeResponse(chunk); // Write partial response chunks to the terminal
    });

    assistant.on(RESPONSE_COMPLETE, () => {
      chat.endResponse(); // Indicate that the response is complete and prompt the user again
    });

    assistant.on(REQUEST_ERROR, (error) => {
      chat.handleError(error); // Handle errors and prompt the user again
    });

    // Start the ChatInterface
    chat.start();
  } catch (error) {
    console.error('The assistant encountered an error:', error); // Handle any errors encountered during the execution.
    process.exit(1); // Exit the process with an error code.
  }
})();
