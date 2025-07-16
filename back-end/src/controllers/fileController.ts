import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { sendToOpenAI } from '../utils/openaiClient';
import multer from 'multer';
import ConvertAPI from 'convertapi';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;

// Refactored: now handles any file type
async function convertFileToText(fileBuffer: Buffer, extension: string): Promise<string> {
  try {
    console.log(`Converting ${extension} file to text using ConvertAPI...`);

    // Create a temporary file with the correct extension
    const tempFilePath = path.join(__dirname, `../../temp_upload${extension}`);
    fs.writeFileSync(tempFilePath, fileBuffer);

    // Initialize ConvertAPI with your API token
    const apiToken = process.env.CONVERTAPI_TOKEN || 'your-api-token-here';
    const convertapi = new ConvertAPI(apiToken);

    // Remove the leading dot from extension for ConvertAPI
    const fromFormat = extension.replace(/^\./, '');

    // Convert file to text
    const result = await convertapi.convert('txt', { File: tempFilePath }, fromFormat);

    // Save the converted text file to a temp path
    const tempTxtPath = path.join(__dirname, '../../temp_upload.txt');
    await result.file.save(tempTxtPath);
    const text = fs.readFileSync(tempTxtPath, 'utf-8');

    // Clean up temporary files
    try {
      fs.unlinkSync(tempFilePath);
      fs.unlinkSync(tempTxtPath);
    } catch (cleanupError) {
      console.error('Error cleaning up temporary files:', cleanupError);
    }

    console.log(`${extension} to text conversion completed`);
    return text;
  } catch (error) {
    console.error(`Error converting ${extension} to text:`, error);
    throw error;
  }
}

// Update extractContentAndLinks to use convertFileToText
async function extractContentAndLinks(fileBuffer: Buffer, extension: string): Promise<{ content: string[], links: string[] }> {
  try {
    // Convert file to text using ConvertAPI
    const textContent = await convertFileToText(fileBuffer, extension);

    // Split the text into pages (assuming pages are separated by form feeds or page breaks)
    const pages = textContent.split(/\f/).filter(page => page.trim());

    // For now, we'll treat the entire text as one page if no page breaks are found
    const extractedText = pages.length > 0 ? pages : [textContent];

    // Only extract links if PDF
    let extractedLinks: string[] = [];
    if (extension === '.pdf') {
      const pdfDataArray = new Uint8Array(fileBuffer);
      const pdfDocument = await pdfjsLib.getDocument({
        data: pdfDataArray,
        useWorkerFetch: false,
        isEvalSupported: false,
        useSystemFonts: true
      }).promise;
      for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
        const page = await pdfDocument.getPage(pageNum);
        const annotations = await page.getAnnotations();
        for (const annotation of annotations) {
          if (annotation.subtype === 'Link' && annotation.url) {
            extractedLinks.push(annotation.url);
          }
        }
      }
    }
    return {
      content: extractedText,
      links: extractedLinks
    };
  } catch (error) {
    console.error('Error extracting content and links:', error);
    return {
      content: [],
      links: []
    };
  }
}

export const uploadFile = async (req: Request, res: Response) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  let filePath: string | undefined;
  try {
    let dataBuffer: Buffer;
    if (req.file.buffer) {
      dataBuffer = req.file.buffer;
    } else if (req.file.path) {
      dataBuffer = fs.readFileSync(req.file.path);
      filePath = req.file.path;
    } else {
      return res.status(400).json({ message: 'File data not found' });
    }
    // Get file extension from originalname
    const extension = path.extname(req.file.originalname).toLowerCase();
    // Use ConvertAPI to extract content and links
    console.log("Extracting File Content and Links ...")
    const extractedData = await extractContentAndLinks(dataBuffer, extension);
    console.log("Extracting File Content and Links Completed.")
    // If extracted content is null or empty, use the file buffer as text
    let content: string;
    if (!extractedData.content || extractedData.content.length === 0) {
      content = dataBuffer.toString('utf-8');
    } else {
      if(extractedData.content.join("").trim() == ''){
        content = dataBuffer.toString('utf-8');
      } else {
        content = extractedData.content.join('\n');
      }
    }
    content = "Filename: "+ req.file.originalname +'\n\n' + content + '\n\n' + extractedData.links.join('\n')
    console.log("Sending to OpenAI ...")
    const result = await sendToOpenAI(content);
    console.log("OpenAI Processing Completed.")
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: (error as Error).message });
  } finally {
    if (filePath) {
      try {
        fs.unlinkSync(filePath);
      } catch (unlinkErr) {
        console.error('Error deleting uploaded file:', unlinkErr);
      }
    }
  }
};