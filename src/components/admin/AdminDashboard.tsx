'use client';

import React, { useState } from 'react';
import { Header } from '../Header';
import { Sidebar } from '../Sidebar';
import { DashboardOverview } from './DashboardOverview';
import { AppointmentsTab } from './AppointmentsTab';
import { PatientsTab } from './PatientsTab';
import { OperatorsTab } from './OperatorsTab';
import { ServicesTab } from './ServicesTab';
import { ReportsTab } from './ReportsTab';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'appointments':
        return <AppointmentsTab />;
      case 'patients':
        return <PatientsTab />;
      case 'operators':
        return <OperatorsTab />;
      case 'services':
        return <ServicesTab />;
      case 'reports':
        return <ReportsTab />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}