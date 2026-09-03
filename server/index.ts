import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env';

// Route imports
import authRoutes from './routes/auth.routes';
import enquiryRoutes from './routes/enquiry.routes';
import societyRoutes from './routes/society.routes';

const app = express();

// Security & Parsing Middleware
app.use(helmet());
app.use(cors({
  origin: [env.APP_URL, 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(env.COOKIE_SECRET));

// Health Check Endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    version: '2.0.0-production'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/societies', societyRoutes);

// 404 Handler for API
app.use('/api/*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: `API Route ${req.method} ${req.originalUrl} not found.`
  });
});

// Global Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  // eslint-disable-next-line no-console
  console.error('[SERVER ERROR]:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error occurred.'
  });
});

const PORT = parseInt(env.PORT, 10) || 5000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`🚀 AuraCar OS Production API Server listening on port ${PORT}`);
    // eslint-disable-next-line no-console
    console.log(`📡 Health Check available at http://localhost:${PORT}/api/health`);
  });
}

export default app;
