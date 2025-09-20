'use client';

import { useState, useEffect } from 'react';
import { Appointment } from '@/types';

// Mock appointments data
const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    ptName: 'John Doe',
    age: 35,
    phoneNo: '+91 9876543210',
    preferredDate: '2025-01-15',
    preferredTime: '10:00',
    purpose: 'eye-test',
    status: 'pending',
    notes: 'Regular checkup',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    ptName: 'Jane Smith',
    age: 28,
    phoneNo: '+91 9876543211',
    preferredDate: '2025-01-16',
    preferredTime: '14:00',
    purpose: 'consultation',
    status: 'confirmed',
    notes: 'Eye strain issues',
    assignedOperator: 'Dr. Sharma',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [loading, setLoading] = useState(false);

  const addAppointment = (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setAppointments(prev => [newAppointment, ...prev]);
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === id 
          ? { ...appointment, ...updates, updatedAt: new Date().toISOString() }
          : appointment
      )
    );
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(appointment => appointment.id !== id));
  };

  return {
    appointments,
    loading,
    addAppointment,
    updateAppointment,
    deleteAppointment,
  };
}