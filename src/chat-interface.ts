import readline from 'readline';
import { EventEmitter } from 'events';
import { USER_INPUT } from './constants'; // Import the event constants

export class ChatInterface extends EventEmitter {
  #rl: readline.Interface;

  constructor() {
    super();
    // Set up the readline interface
    this.#rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    // Set up initial prompt message
    this.#rl.setPrompt('Ask a question about the Code content or type "exit" to quit: \n');
    this.#setupReadlineListeners();
  }

  // Private method to set up readline listeners
  #setupReadlineListeners() {
    this.#rl.on('line', (input) => {
      const question = input.trim();
      if (question.toLowerCase() === 'exit') {
        console.log('Exiting the assistant.');
        this.#rl.close();
      } else {
        // Emit 'USER_INPUT' event with the user's question.
        this.emit(USER_INPUT, question);
      }
    });

    this.#rl.on('close', () => {
      console.log('Interface closed.');
      process.exit(0); // Exit the process when readline is closed.
    });
  }

  // Method to start the UserInterface
  start() {
    this.#rl.prompt();
  }

  // Method to write responses to the console
  writeResponse(response: string) {
    process.stdout.write(response);
  }

  // Method to signal the end of a response
  endResponse() {
    console.log('\n');
    this.#rl.prompt(); // Prompt the user for the next input.
  }

  // Method to handle errors
  handleError(error: Error) {
    console.error(`Error: ${error}`);
    this.#rl.prompt(); // Prompt the user again after an error.
  }
}
