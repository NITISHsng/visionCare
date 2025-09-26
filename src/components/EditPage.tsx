"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useDashboardData } from "@/src/contexts/dataCollection";
import { PatientFullType } from "@/src/contexts/type";

const EditPage = () => {
  const { patients } = useDashboardData();
  const params = useParams();
  const id = params?.id as string;

  const existingPatient = patients.find((p) => p._id === id);

  const [formData, setFormData] = useState<PatientFullType | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existingPatient) {
      setFormData(existingPatient);
    }
  }, [existingPatient]);

  if (!formData) {
    return <p className="p-4 text-gray-600">Loading patient data...</p>;
  }

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
              type === "number"
                ? value === ""
                  ? ""
                  : Number(value) // convert numbers properly
                : value,
          }
        : prev
    );
  };

const handleSave = async () => {
  try {
    setSaving(true);

    // prepare safe copy without mutating state
    const updatedFormData = {
      ...formData,
      updatedAt: new Date().toISOString(),
      due: (formData.total ?? 0) - (formData.advance ?? 0),
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

    // ✅ update local state
    setFormData(updatedFormData);
  } catch (err) {
    console.error("Save failed:", err);
    alert("Failed to save");
  } finally {
    setSaving(false);
  }
};


  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10">
      <h1 className="text-2xl font-bold text-gray-900">Edit Patient</h1>

      {/* Basic Info */}
      <section>
        <h2 className="text-xl font-semibold text-teal-700 mb-4">
          Basic Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Patient Name
            </label>
            <input
              name="ptName"
              readOnly
              value={formData.ptName}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Age
            </label>
            <input
              name="age"
              type="number"
              // readOnly
              value={formData.age}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              name="phoneNo"
              // readOnly
              value={formData.phoneNo}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              name="email"
              // readOnly
              value={formData.email}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              name="gender"
              disabled
              value={formData.gender}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="m">Male</option>
              <option value="f">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              disabled
              value={formData.status}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </section>

      {/* Eye Prescription */}
      <section>
        <h2 className="text-xl font-semibold text-teal-700 mb-4">
          Eye Prescription
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Right Eye Power
            </label>
            <input
              name="rPower"
              value={formData.rPower}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Left Eye Power
            </label>
            <input
              name="lPower"
              value={formData.lPower}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cylinder R
            </label>
            <input
              name="cylinderR"
              value={formData.cylinderR || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cylinder L
            </label>
            <input
              name="cylinderL"
              value={formData.cylinderL || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Axis R
            </label>
            <input
              name="axisR"
              value={formData.axisR || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Axis L
            </label>
            <input
              name="axisL"
              value={formData.axisL || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>
      </section>

      {/* Medical Details */}
      <section>
        <h2 className="text-xl font-semibold text-teal-700 mb-4">
          Medical Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Doctor Name
            </label>
            <input
              name="doctorName"
              value={formData.doctorName || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Diagnosis
            </label>
            <textarea
              name="diagnosis"
              value={formData.diagnosis || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Remarks
            </label>
            <textarea
              name="remarks"
              value={formData.remarks || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>
      </section>

      {/* Order Details */}
      <section>
        <h2 className="text-xl font-semibold text-teal-700 mb-4">
          Order Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bill No
            </label>
            <input
              name="billNo"
              value={formData.billNo}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Vendor
            </label>
            <input
              name="vendor"
              value={formData.vendor || ""}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Frame
            </label>
            <input
              name="frame"
              type="number"
              value={formData.frame || 0}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Lens
            </label>
            <input
              name="lens"
              type="number"
              value={formData.lens || 0}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rate
            </label>
            <input
              name="rate"
              type="number"
              value={formData.rate || 0}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Discount
            </label>
            <input
              name="discount"
              readOnly
              type="number"
              value={formData.discount}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Total
            </label>
            <input
              name="total"
              type="number"
              value={formData.total}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Advance
            </label>
            <input
              name="advance"
              type="number"
              value={formData.advance}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Due
            </label>
            <input
              name="due"
              type="number"
              readOnly
              value={(formData.total ?? 0) - (formData.advance ?? 0)}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700">Received</label>
            <input
              name="received"
              type="number"
              value={formData.received || 0}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div> */}
        </div>
      </section>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default EditPage;
