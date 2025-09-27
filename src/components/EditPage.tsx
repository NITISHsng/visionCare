"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useDashboardData } from "@/src/contexts/dataCollection";
import { PatientFullTypeWithObjectId } from "@/src/contexts/type";

const EditPage = () => {
  const { patients } = useDashboardData();
  const params = useParams();
  const id = params?.id as string;

  const existingPatient = patients.find((p) => p._id === id);

  const [formData, setFormData] = useState<PatientFullTypeWithObjectId | null>(
    null
  );
  const [saving, setSaving] = useState(false);

  const [basicDetails, setbasicDetails] = useState(false);




  useEffect(() => {
    if (existingPatient) {
      setFormData(existingPatient as any); // cast safely
    }
  }, [existingPatient]);

  if (!formData) {
    return <p className="p-4 text-gray-600">Loading patient data...</p>;
  }

  // Generic handler for top-level fields
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) =>
      prev
        ? {
            ...prev,
            [name]:
              type === "number" ? (value === "" ? "" : Number(value)) : value,
            // Auto-update due if advance changes
            ...(name === "advance"
              ? { due: prev.totalAmount - (value === "" ? 0 : Number(value)) }
              : {}),
          }
        : prev
    );
  };

  // Generic nested change handler
  const handleNestedChange = (path: string, value: any) => {
    setFormData((prev) => {
      if (!prev) return prev;

      const newData = { ...prev };
      const keys = path.split(".");

      let temp: any = newData;
      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          temp[key] = value;
        } else {
          temp[key] = { ...temp[key] };
          temp = temp[key];
        }
      });

      return newData;
    });
  };

  // Save handler
  const handleSave = async () => {
    try {
      setSaving(true);

      const updatedFormData = {
        ...formData,
        updatedAt: new Date().toISOString(),
        due: (formData.totalAmount ?? 0) - (formData.advance ?? 0),
      };

      if (!id) throw new Error("Missing patient ID");

      const res = await fetch(`/api/patient?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id, ...updatedFormData }),
      });

      if (!res.ok) throw new Error("Failed to save");

      const data = await res.json();
      console.log("Updated successfully:", data);
      alert("Saved successfully!");

      setFormData(updatedFormData);
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
   <div className="max-w-5xl mx-auto p-6 space-y-8 bg-white shadow rounded-lg">
  {/* Header */}
  <h2 className="text-3xl font-bold text-gray-800">
    Edit Patient <span className="text-sm text-gray-500">#{formData.id}</span>
  </h2>
{
  basicDetails && (
<div>

  {/* Patient Info */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <input
      type="text"
      name="ptName"
      value={formData.ptName}
      onChange={handleChange}
      placeholder="Patient Name"
      className="border p-3 rounded focus:ring-2 focus:ring-blue-400 w-full"
    />
    <input
      type="number"
      name="age"
      value={formData.age}
      onChange={handleChange}
      placeholder="Age"
      className="border p-3 rounded focus:ring-2 focus:ring-blue-400 w-full"
    />
    <select
      name="gender"
      value={formData.gender}
      onChange={handleChange}
      className="border p-3 rounded focus:ring-2 focus:ring-blue-400 w-full"
    >
      <option value="F">Female</option>
      <option value="M">Male</option>
      <option value="Other">Other</option>
    </select>
    <input
      type="text"
      name="phoneNo"
      value={formData.phoneNo}
      onChange={handleChange}
      placeholder="Phone Number"
      className="border p-3 rounded focus:ring-2 focus:ring-blue-400 w-full"
    />
    <input
      type="email"
      name="email"
      value={formData.email || ""}
      onChange={handleChange}
      placeholder="Email"
      className="border p-3 rounded focus:ring-2 focus:ring-blue-400 w-full"
    />
    <input
      type="text"
      name="purpose"
      value={formData.purpose}
      onChange={handleChange}
      placeholder="Purpose"
      className="border p-3 rounded focus:ring-2 focus:ring-blue-400 w-full"
    />
    <input
      type="date"
      name="preferredDate"
      value={formData.preferredDate}
      onChange={handleChange}
      className="border p-3 rounded focus:ring-2 focus:ring-blue-400 w-full"
    />
    <input
      type="time"
      name="preferredTime"
      value={formData.preferredTime}
      onChange={handleChange}
      className="border p-3 rounded focus:ring-2 focus:ring-blue-400 w-full"
    />
    <select
      name="status"
      value={formData.status}
      onChange={handleChange}
      className="border p-3 rounded focus:ring-2 focus:ring-blue-400 w-full"
    >
      <option value="pending">Pending</option>
      <option value="confirmed">Confirmed</option>
      <option value="compleated">Completed</option>
      <option value="canciled">Canceled</option>
    </select>
  </div>

  {/* Notes & Complaints */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="flex flex-col">
      <label className="font-semibold mb-1">Note</label>
      <textarea
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        rows={3}
        className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
      />
    </div>
    <div className="flex flex-col">
      <label className="font-semibold mb-1">Present Complaints</label>
      <textarea
        name="presentComplaints"
        value={formData.presentComplaints}
        onChange={handleChange}
        rows={3}
        className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
      />
    </div>

  </div>
    
</div>
  )
}
<div className="flex justify-end">
  <button
    onClick={() => setbasicDetails(!basicDetails)}
    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
  >
    {basicDetails ? "Hide Basic Details" : "Show Basic Details"}
  </button>
</div>





  {/* Billing & Dates */}
<div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
  <div className="flex-1 flex flex-col">
    <label className="font-medium mb-1">Bill No</label>
    <input
      type="text"
      name="billNo"
      value={formData.billNo}
      onChange={handleChange}
      placeholder="Enter Bill No"
      className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
    />
  </div>
  <div>
     <label className="font-medium mb-5">Examined By</label> <br />
    <select
      name="examinedBy"
      value={formData.examinedBy}
      onChange={handleChange}
      className=""
    >
      <option value="abc">Dr.abc</option>
      <option value="Satish Singha">Dr.Satish Singha</option>
    </select>
  </div>

  <div className="flex-1 flex flex-col">
    <label className="font-medium mb-1">Order Date</label>
    <input
      type="date"
      name="orderDate"
      value={formData.orderDate}
      onChange={handleChange}
      className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
    />
  </div>

  <div className="flex-1 flex flex-col">
    <label className="font-medium mb-1">Delivery Date</label>
    <input
      type="date"
      name="deliveryDate"
      value={formData.deliveryDate}
      onChange={handleChange}
      className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"
    />
  </div>
</div>


  {/* Prescription */}
  <div className="flex flex-col">
    <label className="font-semibold mb-1">Prescription</label>
    <input
      type="text"
      name="prescription"
      value={formData.prescription}
      onChange={handleChange}
      className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
    />
  </div>

  {/* Doctor Remarks */}
  <div className="flex flex-col">
    <label className="font-semibold mb-1">Doctor Remarks</label>
    <textarea
      name="doctorRemarks"
      value={formData.doctorRemarks}
      onChange={handleChange}
      rows={4}
      className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
    />
  </div>

  {/* Payment Details */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div className="flex flex-col">
      <label>Total Amount</label>
      <input
        type="number"
        name="totalAmount"
        value={formData.totalAmount}
        onChange={handleChange}
        className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
      />
    </div>
    <div className="flex flex-col">
      <label>Advance Amount</label>
      <input
        type="number"
        name="advance"
        value={formData.advance}
        onChange={handleChange}
        className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
      />
    </div>
    <div className="flex flex-col">
      <label>Due Amount</label>
      <input
        type="number"
        value={formData.totalAmount - formData.advance}
        disabled
        className="border p-3 rounded w-full bg-gray-100 cursor-not-allowed"
      />
    </div>
  </div>

  {/* Save Button */}
  <div className="flex justify-end">
    <button
      onClick={handleSave}
      disabled={saving}
      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
    >
      {saving ? "Saving..." : "Save"}
    </button>
  </div>
</div>

  );
};

export default EditPage;
