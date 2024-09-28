# My Code Assistant Bot

This project is a code assistant bot that leverages Azure OpenAI to analyze code, provide insights, and assist with code-related queries in a command-line interface. The bot processes files in a specified directory, extracts code content, and allows users to interact with it by asking questions about the code.

## Features

- **File Processing:** Scans a given directory for TypeScript files and extracts their content in a structured format.
- **Azure OpenAI Integration:** Uses OpenAI's GPT-4 model for analyzing code and generating responses based on user questions.
- **Interactive Chat Interface:** Provides a command-line interface for users to ask questions and receive responses.

## Setup

### Prerequisites

- **Node.js**: Ensure you have Node.js installed (version 14 or higher recommended).
- **Azure OpenAI API Key**: You will need an API key from Azure OpenAI and an endpoint URL. Set these in a `.env` file.

### Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:adh-leanix/my-code-assistant.git
   cd my-code-assistant
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add the following environment variables:
   ```
   AZURE_OPENAI_ENDPOINT=<your_azure_openai_endpoint>
   AZURE_OPENAI_API_KEY=<your_api_key>
   ```

## Usage

1. **Start the Bot**:
   Run the bot by providing a directory path containing your TypeScript files. The bot will analyze the files and prepare the context for answering your questions.

   ```bash
   npm start -- /path/to/your/code
   ```

2. **Interacting with the Bot**:
   - The bot will prompt you to ask a question about the code content.
   - Type your question and press `Enter`.
   - To exit, type `exit` and press `Enter`.

## Example

Here is a simple example of how you can use the bot:

1. Start the bot with a directory containing `.ts` files:

   ```bash
   npm start -- ./examples
   ```

2. Ask a question like:

   ```
   How can I refactor the user authentication logic in this codebase?
   ```

3. The bot will provide suggestions based on the code context it analyzed.
