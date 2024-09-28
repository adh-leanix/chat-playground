import { EventEmitter } from 'events';
import { SYSTEM_PROMPT } from './constants';
import { AzureOpenAI } from 'openai';
import { REQUEST_START, USER_INPUT, RECEIVE_RESPONSE, RESPONSE_COMPLETE, REQUEST_ERROR } from './constants';

export class CodeAssistant extends EventEmitter {
  constructor(
    private openai: AzureOpenAI,
    private codeContext: string
  ) {
    super();

    // Bind event listeners for the assistant
    this.#setupAssistantListeners();
  }

  // Method to handle incoming user input
  async #handleUserInput(question: string) {
    try {
      this.emit(REQUEST_START); // Emit request start event

      // Send the user question and code content to Azure OpenAI for generating a response.
      const stream = await this.openai.chat.completions.create({
        max_tokens: 512,
        temperature: 0.2,
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: `The following is a piece of code documentation. Please analyze and remember this code content for future reference.`
          },
          {
            role: 'user',
            content: `${this.codeContext}`
          },
          {
            role: 'user',
            content: `Based on the provided code documentation, here's my question: ${question}`
          }
        ],
        model: 'gpt-4o',
        stream: true
      });

      let responseContent = '';

      // Stream and accumulate the response in real-time.
      for await (const chunk of stream) {
        const textChunk = chunk.choices[0]?.delta?.content || '';
        responseContent += textChunk; // Accumulate the response.
        this.emit(RECEIVE_RESPONSE, textChunk); // Emit partial response.
      }

      // Emit the complete response once the streaming is done.
      this.emit(RESPONSE_COMPLETE, responseContent);
    } catch (error) {
      this.emit(REQUEST_ERROR, error); // Emit error event if request fails.
    }
  }

  // Private method to set up assistant event listeners
  #setupAssistantListeners() {
    // Listen for 'USER_INPUT' event and handle the request.
    this.on(USER_INPUT, (question) => this.#handleUserInput(question));
  }
}
