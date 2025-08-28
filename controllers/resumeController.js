import multer from 'multer';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import mammoth from 'mammoth';
import Resume from '../models/Resume.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 } });
export const uploadResume = upload.single('file');

const getModel = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  const client = new GoogleGenerativeAI(key);
  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  return client.getGenerativeModel({ model: modelName });
};

const extractText = async (buffer, mimetype) => {
  if (mimetype === 'application/pdf') {
    const data = await pdfParse(buffer);
    return data.text || '';
  }
  if (
    mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    mimetype === 'application/msword'
  ) {
    const { value } = await mammoth.extractRawText({ buffer });
    return value || '';
  }
  if (mimetype === 'text/plain') {
    return buffer.toString('utf-8');
  }
  // Fallback: try utf-8
  return buffer.toString('utf-8');
};

export const analyzeResume = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ status: 'fail', message: 'Unauthorized' });
    }

    if (!req.file) {
      return res.status(400).json({ status: 'fail', message: 'No file uploaded' });
    }

    const { originalname, mimetype, size, buffer } = req.file;

    // Extract text
    const text = await extractText(buffer, mimetype);
    if (!text || text.trim().length < 10) {
      return res.status(400).json({ status: 'fail', message: 'Could not extract text from file' });
    }

    // Save to DB
    const doc = await Resume.create({
      user: req.user.id,
      filename: originalname,
      mimetype,
      size,
      content: buffer,
      extractedText: text,
    });

    // Analyze with Gemini
    const model = getModel();
    if (!model) return res.status(503).json({ status: 'error', message: 'AI service not configured' });

    const prompt =
      'You are an ATS and career coach. Analyze the following resume content.\nReturn:' +
      '\n- Summary assessment' +
      '\n- Strengths' +
      '\n- Gaps with suggested bullet improvements' +
      '\n- Keyword optimization tips' +
      '\n- 5 tailored bullet points (STAR style)' +
      `\n\nRESUME TEXT:\n${text}`;

    const result = await model.generateContent(prompt);
    const analysis = result?.response?.text?.() || '';

    // Update doc with analysis
    doc.analysis = analysis;
    await doc.save();

    return res.status(200).json({ status: 'success', data: { id: doc._id, analysis } });
  } catch (err) {
    console.error('Resume analyze error:', err);
    return res.status(500).json({ status: 'error', message: 'Resume analysis failed' });
  }
};
