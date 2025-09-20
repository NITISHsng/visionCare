export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'operator' | 'patient';
  phone?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  id: string;
  fullName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  phone: string;
  email?: string;
  address?: string;
  medicalHistory?: string;
  emergencyContact?: string;
  lastVisit?: string;
  orderDate: string;
  billNo: string;
  rightPower?: string;
  leftPower?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  id: string;
  ptName: string;
  age: number;
  phoneNo: string;
  preferredDate: string;
  preferredTime: string;
  purpose: 'eye-test' | 'frame-selection' | 'consultation' | 'follow-up';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  assignedOperator?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  category: 'examination' | 'treatment' | 'surgery' | 'consultation';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}