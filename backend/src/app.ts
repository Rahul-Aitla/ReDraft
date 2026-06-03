import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import { initializeModels } from './models';
import { errorHandler } from './middleware/errorHandler';
import authRoutes from './routes/auth';
import postsRoutes from './routes/posts';
import blogRoutes from './routes/blog';
import searchRoutes from './routes/search';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/search', searchRoutes);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      code: 'NOT_FOUND',
    },
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Initialize and start server
async function startServer() {
  try {
    // Initialize database
    const sequelize = await initializeDatabase();

    // Initialize models
    await initializeModels(sequelize);

    // Note: Schema is managed via Sequelize migrations, not sync()
    // Run: npm run db:migrate (one-time after schema changes)

    // Start listening
    app.listen(port, () => {
      console.log(`\n🚀 Server is running on http://localhost:${port}`);
      console.log(`📝 API available at http://localhost:${port}/api`);
      console.log(`💾 Database: ${process.env.DATABASE_URL?.split('/').pop()}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default app;
