"use client";

import React, { useState } from "react";
import { Users, Search, Edit, Trash2, User ,Eye} from "lucide-react";
import { useDashboardData } from "@/src/contexts/dataCollection";
import Link from "next/link";

export function PatientsTab() {
  const { patients } = useDashboardData();
  const [searchTerm, setSearchTerm] = useState("");
const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
const [dateFilter, setDateFilter] = useState(today);

  const [repeatedFilter, setRepeatedFilter] = useState(""); // ✅ new filter

  const filteredPatients = patients.filter((patient) => {
    const matchStatus =
      patient.ptName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phoneNo.includes(searchTerm) ||
      patient.billNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchRepeated =
      repeatedFilter === "" // show all
        ? true
        : repeatedFilter === "repeated"
        ? patient.repeated === true
        : patient.repeated === false;

    const matchesDate =
      !dateFilter || patient.preferredDate === dateFilter;

    return matchStatus && matchRepeated && matchesDate;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
        <p className="text-gray-600">
          Manage patient records and prescription information
        </p>
      </div>

 {/* Search + Filters */}
<div className="bg-white flex flex-wrap gap-4 rounded-lg p-4 border border-gray-200">
  {/* Search input */}
  <div className="relative flex-1 min-w-[200px] items-center">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Search
    </label>
    <Search className="absolute left-3 top-2/3  transform -translate-y-1/2 text-gray-400 h-4 w-4" />
    <input
      type="text"
      placeholder="Search by name, phone, bill number, or email..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
    />
  </div>

  {/* Date filter */}
  <div className="min-w-[150px] flex-1 sm:flex-none">
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

  {/* Repeated filter */}
  <div className="min-w-[150px] flex-1 sm:flex-none">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Status
    </label>
    <select
      name="repeated"
      value={repeatedFilter}
      onChange={(e) => setRepeatedFilter(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
    >
      <option value="">All</option>
      <option value="repeated">Repeated</option>
      <option value="new">New</option>
    </select>
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
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone No
                </th>
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bill No
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr key={patient._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-900">
                    <span className="flex items-center gap-2">
                      {patient.repeated ? (
                        <div className="flex space-x-1">
                          <span className="w-3 h-3 rounded-full bg-green-600"></span>
                        </div>
                      ) : (
                        <span className="w-3 h-3 rounded-full bg-green-300"></span>
                      )}
                      {patient.date}
                    </span>
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{patient.ptName}</p>
                        {patient.email && (
                          <p className="text-xs text-gray-500">{patient.email}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-900">
                    {patient.age}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap text-sm text-gray-900">
                    {patient.phoneNo}
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                      {patient.billNo}
                    </span>
                  </td>
                  <td className="px-2 py-3 whitespace-nowrap text-sm font-medium">
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
                        className="text-green-600 hover:text-green-800 p-1 rounded transition-colors"
                        title="Delete Patient"
                      >
                        <Eye className="h-4 w-4" />
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
          <p className="text-gray-500">No patients match your search criteria.</p>
        </div>
      )}
    </div>
  );
}
