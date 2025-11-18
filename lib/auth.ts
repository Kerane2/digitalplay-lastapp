export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'customer' | 'admin';
  image?: string;
}


// TODO: Remplacez cette URL par votre API backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Mock users data (TEMPORAIRE - à supprimer quand vous connectez votre backend)
const MOCK_USERS = [
  {
    id: 'admin-1',
    email: 'admin@digitalplay.ga',
    password: 'admin123',
    full_name: 'Admin Digital Play',
    role: 'admin' as const,
  },
];

export async function login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
  // TODO: Remplacez par votre appel API backend
  /*
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message };
    }
    
    const data = await response.json();
    localStorage.setItem('current_user', JSON.stringify(data.user));
    localStorage.setItem('auth_token', data.token); // Si vous utilisez des tokens
    window.dispatchEvent(new Event('auth-changed'));
    
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: 'Erreur de connexion au serveur' };
  }
  */

  // CODE TEMPORAIRE (localStorage) - à remplacer
  await new Promise(resolve => setTimeout(resolve, 300));

  const mockUser = MOCK_USERS.find(u => u.email === email && u.password === password);
  
  if (mockUser) {
    const user: User = {
      id: mockUser.id,
      email: mockUser.email,
      full_name: mockUser.full_name,
      role: mockUser.role,
    };
    
    localStorage.setItem('current_user', JSON.stringify(user));
    window.dispatchEvent(new Event('auth-changed'));
    
    return { success: true, user };
  }

  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find((u: any) => u.email === email && u.password === password);

  if (user) {
    const userData: User = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role || 'customer',
    };
    
    localStorage.setItem('current_user', JSON.stringify(userData));
    window.dispatchEvent(new Event('auth-changed'));
    
    return { success: true, user: userData };
  }

  return { success: false, error: 'Email ou mot de passe incorrect' };
}

export async function loginWithGoogle(): Promise<{ success: boolean; user?: User; error?: string }> {
  // TODO: Intégrez votre OAuth Google backend ici
  /*
  try {
    window.location.href = `${API_BASE_URL}/auth/google`;
  } catch (error) {
    return { success: false, error: 'Erreur lors de la connexion Google' };
  }
  */
  
  return { success: false, error: 'Connexion Google non disponible pour le moment' };
}

export async function register(email: string, password: string, fullName: string): Promise<{ success: boolean; user?: User; error?: string }> {
  // TODO: Remplacez par votre appel API backend
  /*
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name: fullName }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      return { success: false, error: error.message };
    }
    
    const data = await response.json();
    localStorage.setItem('current_user', JSON.stringify(data.user));
    localStorage.setItem('auth_token', data.token);
    window.dispatchEvent(new Event('auth-changed'));
    
    return { success: true, user: data.user };
  } catch (error) {
    return { success: false, error: 'Erreur lors de l\'inscription' };
  }
  */

  // CODE TEMPORAIRE (localStorage) - à remplacer
  await new Promise(resolve => setTimeout(resolve, 300));

  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  if (users.some((u: any) => u.email === email)) {
    return { success: false, error: 'Cet email est déjà utilisé' };
  }

  const newUser = {
    id: `user-${Date.now()}`,
    email,
    password,
    full_name: fullName,
    role: 'customer' as const,
  };

  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));

  const userData: User = {
    id: newUser.id,
    email: newUser.email,
    full_name: newUser.full_name,
    role: newUser.role,
  };
  
  localStorage.setItem('current_user', JSON.stringify(userData));
  window.dispatchEvent(new Event('auth-changed'));
  
  return { success: true, user: userData };
}

export async function logout() {
  // TODO: Appelez votre API backend pour invalider le token
  /*
  const token = localStorage.getItem('auth_token');
  if (token) {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json' 
      },
    });
  }
  */
  
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
  // TODO: Récupérez l'utilisateur depuis votre backend avec le token
  /*
  const token = localStorage.getItem('auth_token');
  if (!token) return null;
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    localStorage.setItem('current_user', JSON.stringify(data.user));
    return data.user;
  } catch (error) {
    return null;
  }
  */
  
  return getCurrentUser();
}

export function isAdmin(user: User | null): boolean {
  return user?.role === 'admin';
}
