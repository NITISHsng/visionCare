'use client';

import { useState } from 'react';
import { Patient } from '@/types';

// Mock patients data
const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    fullName: 'John Doe',
    age: 35,
    gender: 'male',
    phone: '+91 9876543210',
    email: 'john.doe@email.com',
    address: '123 Main Street, Kachakali',
    medicalHistory: 'Myopia, previous eye surgery in 2020',
    emergencyContact: '+91 9876543220',
    lastVisit: '2024-12-15',
    orderDate: '2024-12-15',
    billNo: 'BILL001',
    rightPower: '-2.50',
    leftPower: '-2.25',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    fullName: 'Jane Smith',
    age: 28,
    gender: 'female',
    phone: '+91 9876543211',
    email: 'jane.smith@email.com',
    address: '456 Oak Avenue, Kachakali',
    medicalHistory: 'No significant medical history',
    emergencyContact: '+91 9876543221',
    lastVisit: '2024-12-10',
    orderDate: '2024-12-10',
    billNo: 'BILL002',
    rightPower: '-1.00',
    leftPower: '-1.25',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [loading, setLoading] = useState(false);

  const addPatient = (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setPatients(prev => [newPatient, ...prev]);
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev => 
      prev.map(patient => 
        patient.id === id 
          ? { ...patient, ...updates, updatedAt: new Date().toISOString() }
          : patient
      )
    );
  };

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(patient => patient.id !== id));
  };

  return {
    patients,
    loading,
    addPatient,
    updatePatient,
    deletePatient,
  };
}