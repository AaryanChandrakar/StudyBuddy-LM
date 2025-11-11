import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// Process document using LangChain loaders
const processDocument = async (filePath, mimeType) => {
  try {
    let loader;

    // Choose appropriate LangChain loader based on file type
    switch (mimeType) {
      case "application/pdf":
        loader = new PDFLoader(filePath);
        break;
      case "text/plain":
      case "text/markdown":
        loader = new TextLoader(filePath);
        break;
      default:
        throw new Error(`Unsupported file type: ${mimeType}`);
    }

    // Load the document
    const docs = await loader.load();

    if (!docs || docs.length === 0) {
      throw new Error("No content found in document");
    }

    // Combine all pages/chunks into single text
    const extractedText = docs.map((doc) => doc.pageContent).join("\n\n");

    if (!extractedText || extractedText.trim().length < 10) {
      throw new Error("No readable text found in document");
    }

    return extractedText.trim();
  } catch (error) {
    throw new Error(`Error processing document: ${error.message}`);
  }
};

// Split text into chunks using LangChain splitter
const splitTextIntoChunks = async (text, options = {}) => {
  try {
    const { chunkSize = 1000, chunkOverlap = 200 } = options;

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize,
      chunkOverlap,
    });

    const chunks = await splitter.splitText(text);
    return chunks.filter((chunk) => chunk.trim().length > 0);
  } catch (error) {
    throw new Error(`Error splitting text: ${error.message}`);
  }
};

export { processDocument, splitTextIntoChunks };
