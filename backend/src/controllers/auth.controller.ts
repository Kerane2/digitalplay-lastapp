import { Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';

export const register = async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, full_name } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hasher le mot de passe
    const password_hash = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .insert([
        {
          email,
          password_hash,
          full_name,
          role: 'user',
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Générer le token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

export const login = async (req: AuthRequest, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Récupérer l'utilisateur
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Vérifier le mot de passe
    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Générer le token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};

export const googleAuth = async (req: AuthRequest, res: Response) => {
  const { id_token } = req.body;

  try {
    // TODO: Vérifier le token Google avec Google OAuth API
    // Pour l'instant, implémentation simplifiée

    const { email, name } = req.body; // Ces infos viennent du token Google décodé

    // Chercher ou créer l'utilisateur
    let { data: user } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (!user) {
      // Créer un nouvel utilisateur Google
      const { data: newUser, error } = await supabaseAdmin
        .from('users')
        .insert([
          {
            email,
            full_name: name,
            role: 'user',
            password_hash: '', // Pas de mot de passe pour OAuth
          },
        ])
        .select()
        .single();

      if (error) throw error;
      user = newUser;
    }

    // Générer le token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Google login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({ error: 'Failed to authenticate with Google' });
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, email, full_name, role, created_at')
      .eq('id', req.user!.id)
      .single();

    if (error) throw error;

    res.json({ user });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  // Avec JWT, la déconnexion se fait côté client en supprimant le token
  res.json({ message: 'Logout successful' });
};
