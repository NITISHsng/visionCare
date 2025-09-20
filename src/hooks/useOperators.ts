'use client';

import { useState } from 'react';
import { User } from '@/types';

// Mock operators data
const MOCK_OPERATORS: User[] = [
  {
    id: '2',
    email: 'operator@kachakali.com',
    fullName: 'Operator Sharma',
    role: 'operator',
    phone: '+91 9876543211',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'operator2@kachakali.com',
    fullName: 'Operator Patel',
    role: 'operator',
    phone: '+91 9876543212',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function useOperators() {
  const [operators, setOperators] = useState<User[]>(MOCK_OPERATORS);
  const [loading, setLoading] = useState(false);

  const addOperator = (operatorData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'role'>) => {
    const newOperator: User = {
      ...operatorData,
      id: Math.random().toString(36).substr(2, 9),
      role: 'operator',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setOperators(prev => [newOperator, ...prev]);
  };

  const updateOperator = (id: string, updates: Partial<User>) => {
    setOperators(prev => 
      prev.map(operator => 
        operator.id === id 
          ? { ...operator, ...updates, updatedAt: new Date().toISOString() }
          : operator
      )
    );
  };

  const deleteOperator = (id: string) => {
    setOperators(prev => prev.filter(operator => operator.id !== id));
  };

  return {
    operators,
    loading,
    addOperator,
    updateOperator,
    deleteOperator,
  };
}