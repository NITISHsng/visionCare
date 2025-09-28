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
  const [showVisionDetails, setShowVisionDetails] = useState(false);
  const [showExamDetails, setShowExamDetails] = useState(false);
  const [showGlassesPrescription, setShowGlassesPrescription] = useState(false);
  const [showIopPachyCCT, setShowIopPachyCCT] = useState(false);
  const [showDiagnosis, setShowDiagnosis] = useState(false);
  const [someDetails, setSomeDetails] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024); // lg breakpoint in Tailwind
    };

    handleResize(); // check on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      localStorage.setItem('activeTab', "patients");

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
        Edit Patient{" "}
        <span className="text-sm text-gray-500">#{formData.id}</span>
      </h2>

      {basicDetails && (
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
      )}
      
      <div className="flex justify-end">
        <button
          onClick={() => setbasicDetails(!basicDetails)}
          className="bg-gray-200 text-black px-3 py-1 rounded hover:bg-gray-300 focus:outline-none "
        >
          {basicDetails ? "Hide Basic Details" : "Show Basic Details"}
        </button>
      </div>

      {(someDetails || isLargeScreen) && (
        <div>
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
        </div>
      )}
<div
  className={
    isLargeScreen
      ? "hidden"
      : someDetails
      ? "flex justify-end items-center py-1 px-2 md:border"
      : "flex justify-between items-center py-1 px-2"
  }
>
  {!someDetails && (
    <span className="text-gray-600">Prescription details</span>
  )}
  <button
    onClick={() => setSomeDetails(!someDetails)}
    className="bg-white text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
  >
    {someDetails
      ? "Hide Prescription Details"
      : "Show Prescription Details"}
  </button>
</div>


      {/* Vision Details */}

      {(isLargeScreen || showVisionDetails) && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">
            Vision Details
          </h3>
          {/* Right Eye Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="font-medium mb-1">
                Right Eye - Unaided Distance
              </label>
              <input
                type="text"
                name="vision.rightEye.unaidedDistance"
                value={formData.vision?.rightEye?.unaidedDistance || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "vision.rightEye.unaidedDistance",
                    e.target.value
                  )
                }
                placeholder="Unaided Distance"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">
                Right Eye - Unaided Near
              </label>
              <input
                type="text"
                name="vision.rightEye.unaidedNear"
                value={formData.vision?.rightEye?.unaidedNear || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "vision.rightEye.unaidedNear",
                    e.target.value
                  )
                }
                placeholder="Unaided Near"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">
                Right Eye - Best Corrected Distance
              </label>
              <input
                type="text"
                name="vision.rightEye.bestCorrectedDistance"
                value={formData.vision?.rightEye?.bestCorrectedDistance || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "vision.rightEye.bestCorrectedDistance",
                    e.target.value
                  )
                }
                placeholder="Best Corrected Distance"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">
                Right Eye - Best Corrected Near
              </label>
              <input
                type="text"
                name="vision.rightEye.bestCorrectedNear"
                value={formData.vision?.rightEye?.bestCorrectedNear || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "vision.rightEye.bestCorrectedNear",
                    e.target.value
                  )
                }
                placeholder="Best Corrected Near"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Left Eye Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="font-medium mb-1">
                Left Eye - Unaided Distance
              </label>
              <input
                type="text"
                name="vision.leftEye.unaidedDistance"
                value={formData.vision?.leftEye?.unaidedDistance || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "vision.leftEye.unaidedDistance",
                    e.target.value
                  )
                }
                placeholder="Unaided Distance"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">
                Left Eye - Unaided Near
              </label>
              <input
                type="text"
                name="vision.leftEye.unaidedNear"
                value={formData.vision?.leftEye?.unaidedNear || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "vision.leftEye.unaidedNear",
                    e.target.value
                  )
                }
                placeholder="Unaided Near"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">
                Left Eye - Best Corrected Distance
              </label>
              <input
                type="text"
                name="vision.leftEye.bestCorrectedDistance"
                value={formData.vision?.leftEye?.bestCorrectedDistance || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "vision.leftEye.bestCorrectedDistance",
                    e.target.value
                  )
                }
                placeholder="Best Corrected Distance"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">
                Left Eye - Best Corrected Near
              </label>
              <input
                type="text"
                name="vision.leftEye.bestCorrectedNear"
                value={formData.vision?.leftEye?.bestCorrectedNear || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "vision.leftEye.bestCorrectedNear",
                    e.target.value
                  )
                }
                placeholder="Best Corrected Near"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* Vision Details Toggle */}
<div
  className={
    isLargeScreen
      ? "hidden"
      : showVisionDetails
      ? "flex justify-end items-center py-1 px-2 md:border"
      : "flex justify-between items-center py-1 px-2"
  }
>
  {!showVisionDetails && (
    <span className="text-gray-600">Vision details </span>
  )}
  <button
    onClick={() => setShowVisionDetails(!showVisionDetails)}
        className="bg-white text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"  
  >
    {showVisionDetails ? "Hide Vision Details" : "Show Vision Details"}
  </button>
</div>


      {/* Exam Details */}
      {(isLargeScreen || showExamDetails) && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">Exam Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="font-medium mb-1">Adnexa</label>
              <input
                type="text"
                name="examDetails.adnexa"
                value={formData.examDetails?.adnexa || ""}
                onChange={(e) =>
                  handleNestedChange("examDetails.adnexa", e.target.value)
                }
                placeholder="Adnexa"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">Conjunctiva</label>
              <input
                type="text"
                name="examDetails.conjunctiva"
                value={formData.examDetails?.conjunctiva || ""}
                onChange={(e) =>
                  handleNestedChange("examDetails.conjunctiva", e.target.value)
                }
                placeholder="Conjunctiva"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">Cornea</label>
              <input
                type="text"
                name="examDetails.cornea"
                value={formData.examDetails?.cornea || ""}
                onChange={(e) =>
                  handleNestedChange("examDetails.cornea", e.target.value)
                }
                placeholder="Cornea"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">Anterior Chamber</label>
              <input
                type="text"
                name="examDetails.anteriorChamber"
                value={formData.examDetails?.anteriorChamber || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "examDetails.anteriorChamber",
                    e.target.value
                  )
                }
                placeholder="Anterior Chamber"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">Iris</label>
              <input
                type="text"
                name="examDetails.iris"
                value={formData.examDetails?.iris || ""}
                onChange={(e) =>
                  handleNestedChange("examDetails.iris", e.target.value)
                }
                placeholder="Iris"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">Lens</label>
              <input
                type="text"
                name="examDetails.lens"
                value={formData.examDetails?.lens || ""}
                onChange={(e) =>
                  handleNestedChange("examDetails.lens", e.target.value)
                }
                placeholder="Lens"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">Fundus</label>
              <input
                type="text"
                name="examDetails.fundus"
                value={formData.examDetails?.fundus || ""}
                onChange={(e) =>
                  handleNestedChange("examDetails.fundus", e.target.value)
                }
                placeholder="Fundus"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">Orbit</label>
              <input
                type="text"
                name="examDetails.orbit"
                value={formData.examDetails?.orbit || ""}
                onChange={(e) =>
                  handleNestedChange("examDetails.orbit", e.target.value)
                }
                placeholder="Orbit"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">Syringing</label>
              <input
                type="text"
                name="examDetails.syringing"
                value={formData.examDetails?.syringing || ""}
                onChange={(e) =>
                  handleNestedChange("examDetails.syringing", e.target.value)
                }
                placeholder="Syringing"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">Vitreous</label>
              <input
                type="text"
                name="examDetails.vitreous"
                value={formData.examDetails?.vitreous || ""}
                onChange={(e) =>
                  handleNestedChange("examDetails.vitreous", e.target.value)
                }
                placeholder="Vitreous"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>
      )}
      {/* Exam Details Toggle */}
<div
  className={
    isLargeScreen
      ? "hidden"
      : showExamDetails
      ? "flex justify-end items-center py-1 px-2 md:border"
      : "flex justify-between items-center py-1 px-2"
  }
>
  {!showExamDetails && (
    <span className="text-gray-600">Write Report</span>
  )}
  <button
    onClick={() => setShowExamDetails(!showExamDetails)}
    className="bg-white text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
  >
             {showExamDetails ? "Hide Exam Details" : "Show Exam Details"}
  </button>
</div>


      {/* Glasses Prescription */}
      {(isLargeScreen || showGlassesPrescription) && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">
            Glasses Prescription
          </h3>
          {/* Use */}
          <div className="flex flex-col">
            <label className="font-medium mb-1">Use</label>
            <input
              type="text"
              name="glassesPrescription.use"
              value={formData.glassesPrescription?.use || ""}
              onChange={(e) =>
                handleNestedChange("glassesPrescription.use", e.target.value)
              }
              placeholder="Use"
              className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
            />
          </div>
          {/* Right Eye Glasses Prescription */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="font-medium mb-1">Right Eye - SPH</label>
              <input
                type="text"
                name="glassesPrescription.rightEye.sph"
                value={formData.glassesPrescription?.rightEye?.sph || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "glassesPrescription.rightEye.sph",
                    e.target.value
                  )
                }
                placeholder="SPH"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">Right Eye - CYL</label>
              <input
                type="text"
                name="glassesPrescription.rightEye.cyl"
                value={formData.glassesPrescription?.rightEye?.cyl || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "glassesPrescription.rightEye.cyl",
                    e.target.value
                  )
                }
                placeholder="CYL"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">Right Eye - Axis</label>
              <input
                type="text"
                name="glassesPrescription.rightEye.axis"
                value={formData.glassesPrescription?.rightEye?.axis || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "glassesPrescription.rightEye.axis",
                    e.target.value
                  )
                }
                placeholder="Axis"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">Right Eye - Prism</label>
              <input
                type="text"
                name="glassesPrescription.rightEye.prism"
                value={formData.glassesPrescription?.rightEye?.prism || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "glassesPrescription.rightEye.prism",
                    e.target.value
                  )
                }
                placeholder="Prism"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">Right Eye - V_A</label>
              <input
                type="text"
                name="glassesPrescription.rightEye.V_A"
                value={formData.glassesPrescription?.rightEye?.V_A || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "glassesPrescription.rightEye.V_A",
                    e.target.value
                  )
                }
                placeholder="V_A"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">Right Eye - N_V</label>
              <input
                type="text"
                name="glassesPrescription.rightEye.N_V"
                value={formData.glassesPrescription?.rightEye?.N_V || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "glassesPrescription.rightEye.N_V",
                    e.target.value
                  )
                }
                placeholder="N_V"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Left Eye Glasses Prescription */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="font-medium mb-1">Left Eye - SPH</label>
              <input
                type="text"
                name="glassesPrescription.leftEye.sph"
                value={formData.glassesPrescription?.leftEye?.sph || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "glassesPrescription.leftEye.sph",
                    e.target.value
                  )
                }
                placeholder="SPH"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">Left Eye - CYL</label>
              <input
                type="text"
                name="glassesPrescription.leftEye.cyl"
                value={formData.glassesPrescription?.leftEye?.cyl || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "glassesPrescription.leftEye.cyl",
                    e.target.value
                  )
                }
                placeholder="CYL"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">Left Eye - Axis</label>
              <input
                type="text"
                name="glassesPrescription.leftEye.axis"
                value={formData.glassesPrescription?.leftEye?.axis || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "glassesPrescription.leftEye.axis",
                    e.target.value
                  )
                }
                placeholder="Axis"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">Left Eye - Prism</label>
              <input
                type="text"
                name="glassesPrescription.leftEye.prism"
                value={formData.glassesPrescription?.leftEye?.prism || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "glassesPrescription.leftEye.prism",
                    e.target.value
                  )
                }
                placeholder="Prism"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">Left Eye - V_A</label>
              <input
                type="text"
                name="glassesPrescription.leftEye.V_A"
                value={formData.glassesPrescription?.leftEye?.V_A || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "glassesPrescription.leftEye.V_A",
                    e.target.value
                  )
                }
                placeholder="V_A"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">Left Eye - N_V</label>
              <input
                type="text"
                name="glassesPrescription.leftEye.N_V"
                value={formData.glassesPrescription?.leftEye?.N_V || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "glassesPrescription.leftEye.N_V",
                    e.target.value
                  )
                }
                placeholder="N_V"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* Glasses Prescription Toggle */}
<div
  className={
    isLargeScreen
      ? "hidden"
      : showGlassesPrescription
      ? "flex justify-end items-center py-1 px-2 md:border"
      : "flex justify-between items-center py-1 px-2"
  }
>
  {!showGlassesPrescription && (
    <span className="text-gray-600">Write Prescription</span>
  )}
  <button
    onClick={() => setShowGlassesPrescription(!showGlassesPrescription)}
    className="bg-white text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
  >
    {showGlassesPrescription ? "Remove Glasses Prescription" : "Add Glasses Prescription"}
  </button>
</div>


      {/* IOP Pachy CCT */}
      {(isLargeScreen || showIopPachyCCT) && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">IOP Pachy CCT</h3>
          {/* Right Eye IOP Pachy CCT */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="font-medium mb-1">Right Eye - IOP</label>
              <input
                type="text"
                name="iopPachyCCT.rightEye.iop"
                value={formData.iopPachyCCT?.rightEye?.iop || ""}
                onChange={(e) =>
                  handleNestedChange("iopPachyCCT.rightEye.iop", e.target.value)
                }
                placeholder="IOP"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">
                Right Eye - correctedIop
              </label>
              <input
                type="text"
                name="iopPachyCCT.rightEye.correctedIop"
                value={formData.iopPachyCCT?.rightEye?.correctedIop || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "iopPachyCCT.rightEye.correctedIop",
                    e.target.value
                  )
                }
                placeholder="Pachy"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">Right Eye - CCT</label>
              <input
                type="text"
                name="iopPachyCCT.rightEye.cct"
                value={formData.iopPachyCCT?.rightEye?.cct || ""}
                onChange={(e) =>
                  handleNestedChange("iopPachyCCT.rightEye.cct", e.target.value)
                }
                placeholder="CCT"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Left Eye IOP Pachy CCT */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label className="font-medium mb-1">Left Eye - IOP</label>
              <input
                type="text"
                name="iopPachyCCT.leftEye.iop"
                value={formData.iopPachyCCT?.leftEye?.iop || ""}
                onChange={(e) =>
                  handleNestedChange("iopPachyCCT.leftEye.iop", e.target.value)
                }
                placeholder="IOP"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">
                Left Eye - correctedIop
              </label>
              <input
                type="text"
                name="iopPachyCCT.leftEye.correctedIop"
                value={formData.iopPachyCCT?.leftEye?.correctedIop || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "iopPachyCCT.leftEye.correctedIop",
                    e.target.value
                  )
                }
                placeholder="Pachy"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex flex-col">
              <label className="font-medium mb-1">Left Eye - CCT</label>
              <input
                type="text"
                name="iopPachyCCT.leftEye.cct"
                value={formData.iopPachyCCT?.leftEye?.cct || ""}
                onChange={(e) =>
                  handleNestedChange("iopPachyCCT.leftEye.cct", e.target.value)
                }
                placeholder="CCT"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
        </div>
      )}
      {/* IOP Pachy CCT Toggle */}
<div
  className={
    isLargeScreen
      ? "hidden"
      : showIopPachyCCT
      ? "flex justify-end items-center py-1 px-2 md:border"
      : "flex justify-between items-center py-1 px-2"
  }
>
  {!showIopPachyCCT && (
    <span className="text-gray-600">Update IOP </span>
  )}
  <button
    onClick={() => setShowIopPachyCCT(!showIopPachyCCT)}
    className="bg-white text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
  >
    {showIopPachyCCT ? "Remove IOP Pachy CCT" : "Add IOP Pachy CCT"}
  </button>
</div>

      {/* Diagnosis */}
      {(isLargeScreen || showDiagnosis) && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">Diagnosis</h3>
          {(formData.diagnosis || []).map((diagnosisItem, index) => (
            <div key={index} className="flex flex-col gap-2">
              <input
                type="text"
                value={diagnosisItem || ""}
                onChange={(e) => {
                  const newDiagnosis = [...(formData.diagnosis || [])];
                  newDiagnosis[index] = e.target.value;
                  handleNestedChange("diagnosis", newDiagnosis);
                }}
                placeholder={`Diagnosis ${index + 1}`}
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              handleNestedChange("diagnosis", [...(formData.diagnosis || []), ""])
            }
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Add Diagnosis
          </button>
        </div>
      )}

      {/* Diagnosis Toggle */}
<div
  className={
    isLargeScreen
      ? "hidden"
      : showDiagnosis
      ? "flex justify-end items-center py-1 px-2 md:border"
      : "flex justify-between items-center py-1 px-2"
  }
>
  {!showDiagnosis && <span className="text-gray-600">No diagnosis added yet</span>}
  <button
    onClick={() => setShowDiagnosis(!showDiagnosis)}
    className="bg-white text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
  >
    {showDiagnosis ? "Remove Diagnosis" : "Add Diagnosis"}
  </button>
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
