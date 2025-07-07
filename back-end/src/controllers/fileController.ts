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

async function convertPDFToText(pdfBuffer: Buffer): Promise<string> {
  try {
    console.log('Converting PDF to text using ConvertAPI...');
    
    // Create a temporary PDF file
    const tempPdfPath = path.join(__dirname, '../../temp_upload.pdf');
    fs.writeFileSync(tempPdfPath, pdfBuffer);
    
    // Initialize ConvertAPI with your API token
    // You should set this as an environment variable
    const apiToken = process.env.CONVERTAPI_TOKEN || 'your-api-token-here';
    const convertapi = new ConvertAPI(apiToken);
    
    // Convert PDF to text
    const result = await convertapi.convert('txt', { File: tempPdfPath }, 'pdf');
    
    // Save the converted text file to a temp path
    const tempTxtPath = path.join(__dirname, '../../temp_upload.txt');
    await result.file.save(tempTxtPath);
    const text = fs.readFileSync(tempTxtPath, 'utf-8');
    
    // Clean up temporary files
    try {
      fs.unlinkSync(tempPdfPath);
      fs.unlinkSync(tempTxtPath);
    } catch (cleanupError) {
      console.error('Error cleaning up temporary files:', cleanupError);
    }
    
    console.log('PDF to text conversion completed');
    return text;
  } catch (error) {
    console.error('Error converting PDF to text:', error);
    throw error;
  }
}

async function extractContentAndLinks(pdfBuffer: Buffer): Promise<{ content: string[], links: string[] }> {
  try {
    // Convert PDF to text using ConvertAPI
    const textContent = await convertPDFToText(pdfBuffer);
    
    // Split the text into pages (assuming pages are separated by form feeds or page breaks)
    const pages = textContent.split(/\f/).filter(page => page.trim());
    
    // For now, we'll treat the entire text as one page if no page breaks are found
    const extractedText = pages.length > 0 ? pages : [textContent];
        
    const pdfDataArray = new Uint8Array(pdfBuffer);
    // Initialize the PDF.js worker
    // You might need to configure the workerSrc depending on your setup
    // pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.mjs'; 
  
    const pdfDocument = await pdfjsLib.getDocument({ 
      data: pdfDataArray,
      useWorkerFetch: false,
      isEvalSupported: false,
      useSystemFonts: true
    }).promise;

    const extractedLinks: string[] = [];

    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);

      // Extract annotations (including links)
      const annotations = await page.getAnnotations();
      for (const annotation of annotations) {
        if (annotation.subtype === 'Link' && annotation.url) { // Check for Link annotations with a URL
          extractedLinks.push(annotation.url);
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

    // Use ConvertAPI to extract content and links
    const extractedData = await extractContentAndLinks(dataBuffer);
    
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
    content = content + '\n\n' + extractedData.links.join('\n')
    
    // Save the PDF content as a text file
    const timestamp = new Date().getTime();
    const originalName = req.file.originalname || 'unknown';
    const textFileName = `${originalName.replace('.pdf', '')}_${timestamp}.txt`;
    const textFilePath = path.join(__dirname, '../../uploads', textFileName);
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Write the PDF content to text file
    fs.writeFileSync(textFilePath, content);
    
    const result = await sendToOpenAI(content);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: (error as Error).message });
  } finally {
    // Remove the uploaded file from disk if it exists
    if (filePath) {
      try {
        fs.unlinkSync(filePath);
      } catch (unlinkErr) {
        console.error('Error deleting uploaded file:', unlinkErr);
      }
    }
  }
};