"use client";

import React, { useState } from "react";
import { Users, Search, Edit, Trash2, User } from "lucide-react";

import { useDashboardData } from "@/src/contexts/dataCollection";
import Link from "next/link";
export function PatientsTab() {
  const { patients } = useDashboardData();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPatients = patients.filter(
    (patient) =>
      patient.ptName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phoneNo.includes(searchTerm) ||
      patient.billNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
        <p className="text-gray-600">
          Manage patient records and prescription information
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search by name, phone, bill number, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order Date
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient Name
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Age
                </th>
                {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th> */}
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone No
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bill No
                </th>
                {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">R Power</th> */}
                {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">L Power</th> */}
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr
                  key={patient.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-900">
                    {/* {new Date(patient.orderDate).toLocaleDateString()} */}
                    {patient.date}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {patient.ptName}
                        </p>
                        {patient.email && (
                          <p className="text-xs text-gray-500">
                            {patient.email}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.age}
                  </td>
                  {/* <td className="px-4 py-4 whitespace-nowrap">
                    <span className="capitalize text-sm text-gray-900">{patient.gender}</span>
                  </td> */}
                  <td className="px-2 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.phoneNo}
                  </td>
                  <td className="px-2 py-4 whitespace-nowrap">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {patient.billNo}
                    </span>
                  </td>
                  {/* <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.rPower || '-'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.lPower || '-'}
                  </td> */}
                  <td className="px-2 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Link href={`edit/${patient._id}`}>
                        <button
                          className="text-teal-600 hover:text-teal-800 p-1 rounded transition-colors"
                          title="Edit Patient"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      </Link>

                      <button
                        // onClick={() => setShowDeleteConfirm(patient.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded transition-colors"
                        title="Delete Patient"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredPatients.length === 0 && (
        <div className="bg-white rounded-lg p-12 border border-gray-200 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No patients found
          </h3>
          <p className="text-gray-500">
            No patients match your search criteria.
          </p>
        </div>
      )}
    </div>
  );
}
