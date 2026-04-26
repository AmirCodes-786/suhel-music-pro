import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import searchRoute from './routes/search.js';
import streamRoute from './routes/stream.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from both the server directory and the root directory
dotenv.config(); // Checks ./server/.env
dotenv.config({ path: path.join(__dirname, '../.env') }); // Checks root .env

const app = express();
const PORT = process.env.PORT || 5000;

// Enable trust proxy for Render/Cloud environments
app.set('trust proxy', 1);

// Configure CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || '*', // Allow specific frontend or all
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/search', searchRoute);
app.use('/api/stream', streamRoute);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
