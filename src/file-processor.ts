import fs from 'fs';
import path from 'path';
import { glob } from 'glob';
import { MatchedFile } from './models';

export class FileProcessor {
  constructor() {}

  // Method to process files and generate code content in Markdown format
  processFiles(basePath: string, pattern = '**/*'): string {
    // Create the glob pattern by joining the base path and the pattern
    const globPattern = path.join(basePath, pattern);

    // Use glob.sync to retrieve all matching files
    const matchedPaths = glob.sync(globPattern, { nodir: true, ignore: ['**/node_modules/**'] });

    const filesWithContent = matchedPaths.map((matchedPath) => {
      const filePath = path.resolve(matchedPath);

      // Resolve the full path using the basePath and file path
      const fileContent = fs.readFileSync(filePath, 'utf-8'); // Read the file content

      // Extract the file name
      const fileName = path.basename(filePath);

      // relative path
      const relativePath = path.relative(basePath, filePath);

      return {
        name: fileName,
        path: relativePath,
        content: fileContent
      };
    });

    const codeContext = this.#generateMarkdownCodeBlock(filesWithContent);
    return codeContext;
  }

  #generateMarkdownCodeBlock(files: MatchedFile[]): string {
    let codeContent = `# Project code\n\n`;

    files.forEach((file: MatchedFile) => {
      codeContent += `## ${file.name}\n\n`;
      codeContent += `\`Path:\` \`${file.path}\`\n\n`;

      // Adding file content as a code block in Markdown
      codeContent += `\`\`\`${path.extname(file.name).substring(1) || 'plaintext'}\n`; // Setting language based on file extension
      codeContent += file.content; // Decoding Base64 content back to UTF-8
      codeContent += `\n\`\`\`\n\n`;
    });

    return codeContent;
  }
}
