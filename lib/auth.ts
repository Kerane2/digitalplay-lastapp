export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'customer' | 'admin';
  image?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Email ou mot de passe incorrect' };
    }
    
    const data = await response.json();
    const user: User = {
      id: data.user.id,
      email: data.user.email,
      full_name: data.user.full_name,
      role: data.user.role,
    };
    
    localStorage.setItem('current_user', JSON.stringify(user));
    localStorage.setItem('auth_token', data.token);
    window.dispatchEvent(new Event('auth-changed'));
    
    return { success: true, user };
  } catch (error) {
    console.error('[v0] Login error:', error);
    return { success: false, error: 'Erreur de connexion au serveur' };
  }
}

export async function loginWithGoogle(): Promise<{ success: boolean; user?: User; error?: string }> {
  // TODO: Implement OAuth Google when needed
  return { success: false, error: 'Connexion Google non disponible pour le moment' };
}

export async function register(email: string, password: string, fullName: string): Promise<{ success: boolean; user?: User; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password, full_name: fullName }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message || 'Erreur lors de l\'inscription' };
    }
    
    const data = await response.json();
    const user: User = {
      id: data.user.id,
      email: data.user.email,
      full_name: data.user.full_name,
      role: data.user.role,
    };
    
    localStorage.setItem('current_user', JSON.stringify(user));
    localStorage.setItem('auth_token', data.token);
    window.dispatchEvent(new Event('auth-changed'));
    
    return { success: true, user };
  } catch (error) {
    console.error('[v0] Registration error:', error);
    return { success: false, error: 'Erreur lors de l\'inscription' };
  }
}

export async function logout() {
  const token = localStorage.getItem('auth_token');
  
  if (token) {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        credentials: 'include',
      });
    } catch (error) {
      console.error('[v0] Logout error:', error);
    }
  }
  
  localStorage.removeItem('current_user');
  localStorage.removeItem('auth_token');
  window.dispatchEvent(new Event('auth-changed'));
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('current_user');
  return userStr ? JSON.parse(userStr) : null;
}

export async function fetchCurrentUser(): Promise<User | null> {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
      credentials: 'include',
    });
    
    if (!response.ok) {
      localStorage.removeItem('current_user');
      localStorage.removeItem('auth_token');
      return null;
    }
    
    const data = await response.json();
    const user: User = {
      id: data.user.id,
      email: data.user.email,
      full_name: data.user.full_name,
      role: data.user.role,
    };
    
    localStorage.setItem('current_user', JSON.stringify(user));
    return user;
  } catch (error) {
    console.error('[v0] Fetch current user error:', error);
    return null;
  }
}

export function isAdmin(user: User | null): boolean {
  return user?.role === 'admin';
}
