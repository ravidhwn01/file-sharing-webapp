import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

// File storage
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, 'uploads');
import fs from 'fs';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// MongoDB
// mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/sharefiles');
mongoose.connect(process.env.MONGO_URI);
const fileSchema = new mongoose.Schema({
  key: String,
  originalName: String,
  filename: String,
  mimetype: String,
  size: Number,
  createdAt: { type: Date, default: Date.now }
});
const File = mongoose.model('File', fileSchema);

// Upload endpoint
app.post('/upload', upload.array('files'), async (req, res) => {
  const { key } = req.body;
  if (!key || !req.files) return res.status(400).json({ error: 'Key and files required' });
  const files = req.files.map(file => ({
    key,
    originalName: file.originalname,
    filename: file.filename,
    mimetype: file.mimetype,
    size: file.size
  }));
  await File.insertMany(files);
  res.json({ success: true });
});

// List files by key
app.get('/files/:key', async (req, res) => {
  const files = await File.find({ key: req.params.key });
  res.json({ files });
});


// Download file by id
app.get('/download/:id', async (req, res) => {
  const file = await File.findById(req.params.id);
  if (!file) return res.status(404).send('File not found');
  res.download(path.join(uploadDir, file.filename), file.originalName);
});


// Delete all files for a key
app.delete('/files/:key', async (req, res) => {
  try {
    const files = await File.find({ key: req.params.key });
    if (!files.length) return res.status(404).json({ error: 'No files found for this key' });
    // Remove files from disk
    for (const file of files) {
      const filePath = path.join(uploadDir, file.filename);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        // Ignore file not found errors
      }
    }
    // Remove from database
    await File.deleteMany({ key: req.params.key });
    res.json({ success: true, deleted: files.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete files' });
  }
});

// Delete a single file by its ID
app.delete('/file/:id', async (req, res) => {
  try {
    const file = await File.findById(req.params.id);
    if (!file) return res.status(404).json({ error: 'File not found' });
    const filePath = path.join(uploadDir, file.filename);
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      // Ignore file not found errors
    }
    await File.deleteOne({ _id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port', PORT));
