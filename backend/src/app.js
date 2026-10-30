import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*', credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', function healthCheck(_req, res) {
  res.json({ ok: true });
});
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
