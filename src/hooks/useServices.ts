'use client';

import { useState, useEffect } from 'react';
import { Service } from '@/types';

// Mock services data
const MOCK_SERVICES: Service[] = [
  {
    id: '1',
    name: 'Comprehensive Eye Examination',
    description: 'Complete eye health assessment including vision testing, refraction, and eye disease screening',
    price: 1500,
    duration: '60 minutes',
    category: 'examination',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Contact Lens Fitting',
    description: 'Professional contact lens consultation and fitting service',
    price: 2000,
    duration: '45 minutes',
    category: 'consultation',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Retinal Photography',
    description: 'Advanced retinal imaging for early detection of eye diseases',
    price: 2500,
    duration: '30 minutes',
    category: 'examination',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Glaucoma Screening',
    description: 'Specialized screening for glaucoma detection and monitoring',
    price: 3000,
    duration: '45 minutes',
    category: 'examination',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function useServices() {
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [loading, setLoading] = useState(false);

  const addService = (serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newService: Service = {
      ...serviceData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setServices(prev => [newService, ...prev]);
  };

  const updateService = (id: string, updates: Partial<Service>) => {
    setServices(prev => 
      prev.map(service => 
        service.id === id 
          ? { ...service, ...updates, updatedAt: new Date().toISOString() }
          : service
      )
    );
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(service => service.id !== id));
  };

  return {
    services,
    loading,
    addService,
    updateService,
    deleteService,
  };
}