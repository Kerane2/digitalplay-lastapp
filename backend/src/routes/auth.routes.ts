import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Inscription
router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('full_name').trim().notEmpty(),
  ],
  authController.register
);

// Connexion
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  authController.login
);

// Google OAuth
router.post('/google', authController.googleAuth);

// Informations utilisateur actuel
router.get('/me', authenticateToken, authController.getCurrentUser);

// Déconnexion
router.post('/logout', authenticateToken, authController.logout);

export default router;
