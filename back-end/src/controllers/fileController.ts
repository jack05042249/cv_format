import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { sendToOpenAI } from '../utils/openaiClient';
import multer from 'multer';
// import ConvertAPI from 'convertapi';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import mammoth from 'mammoth';
import { createCanvas } from 'canvas';
import Tesseract from 'tesseract.js';
const pdf_poppler = require('pdf-poppler');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default upload;

// Update extractContentAndLinks to use convertFileToText
async function extractContentAndLinks(fileBuffer: Buffer, filepath:string, extension: string): Promise<{ content: string[], links: string[] }> {
  try {
    let extractedLinks: string[] = [];
    let extractedText: string[] = [];
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
        // Extract text content
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(' '); // Join text items with spaces
        extractedText.push(pageText);
        const annotations = await page.getAnnotations();
        for (const annotation of annotations) {
          if (annotation.subtype === 'Link' && annotation.url) {
            extractedLinks.push(annotation.url);
          }
        }
      }
      // OCR fallback if all extracted text is empty or whitespace
      if (extractedText.join('').trim() === '') {
        extractedText = [];
        let allImageFiles: string[] = [];
        for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
          let opts = {
            format: 'jpeg',
            out_dir: filepath ? path.dirname(filepath) : '',
            out_prefix: filepath ? path.basename(filepath, path.extname(filepath)) : '',
            page: pageNum
          };
          await pdf_poppler.convert(filepath, opts)
            .then((res: any) => {
              console.log(res, 'Successfully converted');
            })
            .catch((error: any) => {
              console.error(error);
            });
          // Find all generated image files for this page
          const prefix = opts.out_prefix;
          const outDir = opts.out_dir;
          const imageFiles = fs.readdirSync(outDir)
            .filter((f: string) => f.startsWith(prefix) && f.endsWith('.jpg'))
            .map((f: string) => path.join(outDir, f));
          allImageFiles.push(...imageFiles);
        }
        // Run OCR on all images in parallel
        const ocrResults = await Promise.all(
          allImageFiles.map(imgPath =>
            Tesseract.recognize(imgPath, 'eng').then(({ data: { text } }) => text)
          )
        );
        extractedText.push(...ocrResults);
        // Optionally, clean up image files after OCR
        for (const imgPath of allImageFiles) {
          try { fs.unlinkSync(imgPath); } catch {}
        }
      }
    } else if (extension === '.docx' || extension === '.doc') {
      // Use mammoth to extract text from DOCX
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      extractedText = [result.value];
      // Extract URLs from the text using regex
      const urlRegex = /https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+/gi;
      extractedLinks = result.value.match(urlRegex) || [];
    } else if (extension === '.txt') {
      // Plain text extraction
      const text = fileBuffer.toString('utf-8');
      extractedText = [text];
      // Extract URLs from the text using regex
      const urlRegex = /https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+/gi;
      extractedLinks = text.match(urlRegex) || [];
    } else {
      // Fallback: try to read as UTF-8 text
      const text = fileBuffer.toString('utf-8');
      extractedText = [text];
      // Extract URLs from the text using regex
      const urlRegex = /https?:\/\/[\w\-._~:/?#[\]@!$&'()*+,;=%]+/gi;
      extractedLinks = text.match(urlRegex) || [];
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

// Helper for pdfjsLib to use node-canvas in Node.js
const canvasFactory = {
  create: (width: number, height: number) => {
    const canvas = createCanvas(width, height);
    const context = canvas.getContext('2d');
    return { canvas, context };
  },
  reset: (canvasAndContext: { canvas: any; context: any }, width: number, height: number) => {
    canvasAndContext.canvas.width = width;
    canvasAndContext.canvas.height = height;
  },
  destroy: (canvasAndContext: { canvas: any; context: any }) => {
    canvasAndContext.canvas.width = 0;
    canvasAndContext.canvas.height = 0;
    canvasAndContext.canvas = null;
    canvasAndContext.context = null;
  },
};

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
    const extractedData = await extractContentAndLinks(dataBuffer, filePath || '', extension);
    console.log("Extracting File Content and Links Completed.")
    // If extracted content is null or empty, use the file buffer as text
    let content: string;
    if (!extractedData.content || extractedData.content.length === 0) {
      res.status(500).json({ message: 'Unable to process this file. Please check the file type and content.'});
    } else {
      if(extractedData.content.join("").trim() == ''){
        res.status(500).json({ message: 'Unable to process this file. Please check the file type and content.'});
      } else {
        content = extractedData.content.join('\n');
        content = "Filename: "+ req.file.originalname +'\n\n' + content + '\n\n' + extractedData.links.join('\n')
        console.log("Sending to OpenAI ...")
        const result = await sendToOpenAI(content);
        console.log("OpenAI Processing Completed.")
        res.json(result);
      }
    }
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