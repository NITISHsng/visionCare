'use client';

import { useState } from 'react';

import { Staff } from '../contexts/type';
// Mock operators data
const MOCK_OPERATORS: Staff[] = [
  {
    id: '2',
    email: 'operator@kachakali.com',
    name: 'Operator Sharma',
    role: 'operator',
    phone: '+91 9876543211',
    password:"password",
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'operator2@kachakali.com',
    name: 'Operator Patel',
    role: 'operator',
    phone: '+91 9876543212',
     password:"password",
    createdAt: new Date().toISOString(),
  },
];

export function useOperators() {
  const [operators, setOperators] = useState<Staff[]>(MOCK_OPERATORS);
  const [loading, setLoading] = useState(false);

  const addOperator = (operatorData: Omit<Staff, 'id' | 'createdAt' | 'updatedAt' | 'role'>) => {
    const newOperator: Staff = {
      ...operatorData,
      id: Math.random().toString(36).substr(2, 9),
      role: 'operator',
      createdAt: new Date().toISOString(),
    };
    
    setOperators(prev => [newOperator, ...prev]);
  };

  const updateOperator = (id: string, updates: Partial<Staff>) => {
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