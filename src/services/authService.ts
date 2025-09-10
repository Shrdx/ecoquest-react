import { User, LoginCredentials, SignupCredentials, EcoTheme } from '@/types/auth';

const ECO_THEMES: EcoTheme[] = [
  { name: 'Forest', primary: '#22c55e', secondary: '#16a34a', background: 'from-green-900/20 to-emerald-900/20' },
  { name: 'Ocean', primary: '#06b6d4', secondary: '#0891b2', background: 'from-cyan-900/20 to-blue-900/20' },
  { name: 'Desert', primary: '#f59e0b', secondary: '#d97706', background: 'from-amber-900/20 to-orange-900/20' },
  { name: 'Arctic', primary: '#8b5cf6', secondary: '#7c3aed', background: 'from-purple-900/20 to-indigo-900/20' }
];

const AVATARS = [
  '🌱', '🌳', '🌊', '🌍', '♻️', '🔋', '☀️', '💨', '🦋', '🐢', '🐧', '🌸'
];

// Simulate API delays
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class AuthService {
  static async login(credentials: LoginCredentials): Promise<User> {
    await delay(1000);
    
    // Mock validation
    if (!credentials.email || !credentials.password) {
      throw new Error('Email and password are required');
    }
    
    if (!credentials.email.includes('@')) {
      throw new Error('Invalid email format');
    }
    
    if (credentials.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    
    // Check if user exists in localStorage
    const existingUsers = this.getStoredUsers();
    const user = existingUsers.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error('User not found. Please sign up first.');
    }
    
    // In a real app, you'd verify the password hash
    const updatedUser = {
      ...user,
      lastLogin: new Date().toISOString(),
      isNewUser: false
    };
    
    // Update stored users
    const updatedUsers = existingUsers.map(u => u.id === user.id ? updatedUser : u);
    localStorage.setItem('ecoquest_users', JSON.stringify(updatedUsers));
    
    return updatedUser;
  }
  
  static async signup(credentials: SignupCredentials): Promise<User> {
    await delay(1200);
    
    // Validation
    if (!credentials.name || !credentials.email || !credentials.password) {
      throw new Error('All fields are required');
    }
    
    if (!credentials.email.includes('@')) {
      throw new Error('Invalid email format');
    }
    
    if (credentials.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }
    
    if (credentials.password !== credentials.confirmPassword) {
      throw new Error('Passwords do not match');
    }
    
    // Check if user already exists
    const existingUsers = this.getStoredUsers();
    if (existingUsers.find(u => u.email === credentials.email)) {
      throw new Error('User with this email already exists');
    }
    
    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}`,
      email: credentials.email,
      name: credentials.name,
      avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
      theme: ECO_THEMES[0], // Default to Forest theme
      joinDate: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      isNewUser: true
    };
    
    // Store user
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem('ecoquest_users', JSON.stringify(updatedUsers));
    
    return newUser;
  }
  
  static async logout(): Promise<void> {
    await delay(300);
    localStorage.removeItem('ecoquest_current_user');
  }
  
  static getCurrentUser(): User | null {
    try {
      const userData = localStorage.getItem('ecoquest_current_user');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }
  
  static setCurrentUser(user: User): void {
    localStorage.setItem('ecoquest_current_user', JSON.stringify(user));
  }
  
  static updateUser(updates: Partial<User>): User | null {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return null;
    
    const updatedUser = { ...currentUser, ...updates };
    this.setCurrentUser(updatedUser);
    
    // Also update in users list
    const existingUsers = this.getStoredUsers();
    const updatedUsers = existingUsers.map(u => u.id === currentUser.id ? updatedUser : u);
    localStorage.setItem('ecoquest_users', JSON.stringify(updatedUsers));
    
    return updatedUser;
  }
  
  private static getStoredUsers(): User[] {
    try {
      const users = localStorage.getItem('ecoquest_users');
      return users ? JSON.parse(users) : [];
    } catch {
      return [];
    }
  }
  
  static getEcoThemes(): EcoTheme[] {
    return ECO_THEMES;
  }
  
  static getAvatars(): string[] {
    return AVATARS;
  }
}
