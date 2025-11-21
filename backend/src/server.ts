import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';

import { initializeDatabase } from './config/database';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/auth.routes';
import productsRoutes from './routes/products.routes';
import categoriesRoutes from './routes/categories.routes';
import ordersRoutes from './routes/orders.routes';
import cartRoutes from './routes/cart.routes';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

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

// Filesystem check and debug logs for static files
const adminPath = path.join(__dirname, '../public/admin');
console.log('[v0] Admin path:', adminPath);
console.log('[v0] Admin path exists:', fs.existsSync(adminPath));
if (fs.existsSync(adminPath)) {
  console.log('[v0] Files in admin:', fs.readdirSync(adminPath));
}

app.use('/admin', express.static(adminPath, {
  index: 'index.html',
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Content-Type', 'text/html');
    }
  }
}));

// Root route
app.get('/', (req, res) => {
  res.redirect('/admin');
});

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Digital Play API is running' });
});

// Routes API
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/cart', cartRoutes);

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
      console.log(`🔗 Admin Dashboard: http://localhost:${PORT}/admin`);
      console.log(`🔗 API URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
