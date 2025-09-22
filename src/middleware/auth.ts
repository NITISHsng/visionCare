// Authentication middleware for role-based access control
import { NextRequest } from 'next/server';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'operator' | 'patient';
  phone?: string;
  isActive: boolean;
}

// Mock users for demonstration - in production, this would come from a database
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@kachakali.com',
    fullName: 'Dr. Admin Kumar',
    role: 'admin',
    phone: '+91 9876543210',
    isActive: true,
  },
  {
    id: '2',
    email: 'operator@kachakali.com',
    fullName: 'Operator Sharma',
    role: 'operator',
    phone: '+91 9876543211',
    isActive: true,
  },
];

// Validate user credentials
export function validateUser(email: string, password: string): User | null {
  const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  if (user && password === 'password123' && user.isActive) {
    return user;
  }
  
  return null;
}

// Get user from session/token (simplified for demo)
export function getUserFromSession(request: NextRequest): User | null {
  try {
    const userCookie = request.cookies.get('user-session');
    if (!userCookie) return null;
    
    const userData = JSON.parse(userCookie.value);
    return userData;
  } catch {
    return null;
  }
}

// Check if user has required role
export function hasRole(user: User | null, requiredRole: string): boolean {
  if (!user || !user.isActive) return false;
  return user.role === requiredRole;
}

// Check if user can access admin routes
export function canAccessAdmin(user: User | null): boolean {
  return hasRole(user, 'admin');
}

// Check if user can access operator routes
export function canAccessOperator(user: User | null): boolean {
  return hasRole(user, 'operator') || hasRole(user, 'admin'); // Admin can access operator routes
}