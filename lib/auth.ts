export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'customer' | 'admin';
  image?: string;
}

const MOCK_USERS = [
  {
    id: '1',
    email: 'admin@digitalplay.ga',
    password: 'admin123',
    full_name: 'Admin User',
    role: 'admin' as const,
  },
  {
    id: '2',
    email: 'customer@example.com',
    password: 'customer123',
    full_name: 'John Doe',
    role: 'customer' as const,
  },
];

// Client-side authentication
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('current_user');
  return userStr ? JSON.parse(userStr) : null;
}

export function login(email: string, password: string): { success: boolean; user?: User; error?: string } {
  const user = MOCK_USERS.find((u) => u.email === email && u.password === password);
  
  if (!user) {
    return { success: false, error: 'Email ou mot de passe incorrect' };
  }

  const { password: _, ...userWithoutPassword } = user;
  localStorage.setItem('current_user', JSON.stringify(userWithoutPassword));
  window.dispatchEvent(new Event('auth-changed'));
  
  return { success: true, user: userWithoutPassword };
}

export function loginWithGoogle(): { success: boolean; user?: User } {
  // Mock Google login for preview
  const googleUser: User = {
    id: Math.random().toString(36).substring(7),
    email: 'user@gmail.com',
    full_name: 'Google User',
    role: 'customer',
    image: '/diverse-user-avatars.png',
  };

  localStorage.setItem('current_user', JSON.stringify(googleUser));
  window.dispatchEvent(new Event('auth-changed'));
  
  return { success: true, user: googleUser };
}

export function register(email: string, password: string, fullName: string): { success: boolean; user?: User; error?: string } {
  if (MOCK_USERS.find((u) => u.email === email)) {
    return { success: false, error: 'Cet email est déjà utilisé' };
  }

  const newUser: User = {
    id: Math.random().toString(36).substring(7),
    email,
    full_name: fullName,
    role: 'customer',
  };

  localStorage.setItem('current_user', JSON.stringify(newUser));
  window.dispatchEvent(new Event('auth-changed'));
  
  return { success: true, user: newUser };
}

export function logout() {
  localStorage.removeItem('current_user');
  window.dispatchEvent(new Event('auth-changed'));
}

export function isAdmin(user: User | null): boolean {
  return user?.role === 'admin';
}
