'use client';

import React from 'react';
import { 
  Users,ShieldCheck, Calendar, Clock, CheckCircle, 
 XCircle 
} from 'lucide-react';

 import { IndianRupee, CreditCard, Wallet } from "lucide-react";
import { useDashboardData } from '@/src/contexts/dataCollection';
export function DashboardOverview() {
  const {staffs,appointments,patients}=useDashboardData();

const { totalAdvance, totalDue, totalAmount } = patients.reduce(
  (acc, patient) => {
    acc.totalAdvance += patient.advance ?? 0;
    acc.totalDue += patient.due ?? 0;
    acc.totalAmount += patient.totalAmount ?? 0;
    return acc;
  },
  { totalAdvance: 0, totalDue: 0, totalAmount: 0 }
);


  const stats = {
    totalPatients: patients.length,
    totalOperators: staffs.length,
    todayAppointments: appointments.filter(apt => 
      new Date(apt.preferredDate).toDateString() === new Date().toDateString()
    ).length,
    pendingAppointments: appointments.filter(apt => apt.status === 'pending').length,
    confirmedAppointments: appointments.filter(apt => apt.status === 'confirmed').length,
    completedAppointments: appointments.filter(apt => apt.status === 'completed').length,
    cancelledAppointments: appointments.filter(apt => apt.status === 'cancelled').length,
  };

  const recentAppointments = appointments.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening at your clinic today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {/* Total Amount */}
  <div className="bg-white rounded-lg p-6 border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">Total Amount</p>
        <p className="text-2xl font-bold text-gray-900">{totalAmount}</p>
      </div>
      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
        <IndianRupee className="h-6 w-6 text-blue-600" />
      </div>
    </div>
  </div>

  {/* Total Collection */}
  <div className="bg-white rounded-lg p-6 border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">Total Collection</p>
        <p className="text-2xl font-bold text-gray-900">{totalAdvance}</p>
      </div>
      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
        <CreditCard className="h-6 w-6 text-green-600" />
      </div>
    </div>
  </div>

  {/* Total Due */}
  <div className="bg-white rounded-lg p-6 border border-gray-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">Total Due</p>
        <p className="text-2xl font-bold text-gray-900">{totalDue}</p>
      </div>
      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
        <Wallet className="h-6 w-6 text-red-600" />
      </div>
    </div>
  </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900">{staffs.length}</p>
            </div>
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <ShieldCheck className="h-6 w-6 text-teal-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-900">
                {/* {stats.todayAppointments} */}
                {appointments.length}
                </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingAppointments}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Status Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-orange-500" />
                <span className="text-gray-700">Pending</span>
              </div>
              <span className="font-semibold text-orange-600">{stats.pendingAppointments}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-gray-700">Confirmed</span>
              </div>
              <span className="font-semibold text-green-600">{stats.confirmedAppointments}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-blue-500" />
                <span className="text-gray-700">Completed</span>
              </div>
              <span className="font-semibold text-blue-600">{stats.completedAppointments}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-red-500" />
                <span className="text-gray-700">Cancelled</span>
              </div>
              <span className="font-semibold text-red-600">{stats.cancelledAppointments}</span>
            </div>
          </div>
        </div>

        {/* Recent Appointments */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Appointments</h3>
          <div className="space-y-3">
            {recentAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{appointment.ptName}</p>
                  <p className="text-sm text-gray-500">{appointment.preferredDate} at {appointment.preferredTime}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  appointment.status === 'pending' ? 'bg-orange-100 text-orange-700' :
                  appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                  appointment.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {appointment.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}