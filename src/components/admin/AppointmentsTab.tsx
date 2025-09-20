"use client";

import React, { useState } from "react";
import { Calendar, Clock, Phone, Eye, Plus, Search,CheckCircle } from "lucide-react";
import { useAppointments } from "@/src/hooks/useAppointments";
import AppointmentForm from "@/src/components/AppointmentForm"
export function AppointmentsTab() {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const { appointments, updateAppointment, deleteAppointment } =
    useAppointments();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;
    const matchesSearch =
      appointment.ptName
        // .toLowerCase()
        // .includes(searchTerm.toLowerCase()) ||
      // appointment.phoneNo.includes(searchTerm);
    const matchesDate = !dateFilter || appointment.preferredDate === dateFilter;
    return matchesStatus && matchesSearch && matchesDate;
  });

  const handleStatusChange = (id: string, newStatus: string) => {
    updateAppointment(id, { status: newStatus as any });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Appointment Management
          </h1>
          <p className="text-gray-600">
            View and manage all patient appointments
          </p>
        </div>
        <button
          onClick={() => setShowBookingForm(true)}
          className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Appointment</span>
        </button>
      </div>


    {showBookingForm && (
  <div>
    <AppointmentForm setShowBookingForm={setShowBookingForm} setBookingSuccess={setBookingSuccess}/>
  </div>
)}
      {/* Success Message */}
      {bookingSuccess && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-green-800">Appointment booked successfully! We'll contact you soon to confirm.</span>
          </div>
        </div>
      )}

      {/* Advanced Filters */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Patient name or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setDateFilter("");
              }}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Appointments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {appointment.ptName}
                </h3>
                <p className="text-sm text-gray-500">Age: {appointment.age}</p>
              </div>
              <select
                value={appointment.status}
                onChange={(e) =>
                  handleStatusChange(appointment.id, e.target.value)
                }
                className={`text-xs rounded-full px-3 py-1 font-medium border-0 focus:ring-2 focus:ring-teal-500 ${
                  appointment.status === "pending"
                    ? "bg-orange-100 text-orange-700"
                    : appointment.status === "confirmed"
                    ? "bg-green-100 text-green-700"
                    : appointment.status === "completed"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>{appointment.preferredDate}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{appointment.preferredTime}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{appointment.phoneNo}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Eye className="h-4 w-4" />
                <span className="capitalize">
                  {appointment.purpose.replace("-", " ")}
                </span>
              </div>
            </div>

            {appointment.notes && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  <strong>Notes:</strong> {appointment.notes}
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => deleteAppointment(appointment.id)}
                className="px-3 py-1 text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredAppointments.length === 0 && (
        <div className="bg-white rounded-lg p-12 border border-gray-200 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No appointments found
          </h3>
          <p className="text-gray-500">
            No appointments match your current filters.
          </p>
        </div>
      )}
    </div>
  );
}
