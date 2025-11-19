import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { initializeDatabase } from './config/database';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/auth.routes';
import productsRoutes from './routes/products.routes';
import categoriesRoutes from './routes/categories.routes';
import ordersRoutes from './routes/orders.routes';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de sécurité
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Route de santé
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Digital Play API is running' });
});

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/orders', ordersRoutes);

// Gestionnaire d'erreurs
app.use(errorHandler);

// Route 404
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Démarrer le serveur
const startServer = async () => {
  try {
    // Initialiser la connexion à la base de données
    await initializeDatabase();

    // Démarrer le serveur Express
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 API URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
