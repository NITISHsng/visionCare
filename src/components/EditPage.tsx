"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useDashboardData } from "@/src/contexts/dataCollection";
import { PatientFullTypeWithObjectId } from "@/src/contexts/type";
import toast from "react-hot-toast";
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
      localStorage.setItem("activeTab", "patients");
      toast.success("Saved successfully!");
      setFormData(updatedFormData);
    } catch (err) {
      console.error("Save failed:", err);
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };
type ToggleInfo = {
  isOpen: boolean;
  onToggle: () => void;
  closedLabel: string;
  buttonLabels: { open: string; closed: string };
};

const renderToggleSection = (
  info: ToggleInfo,
  isLargeScreen: boolean
) => {
  const { isOpen, onToggle, closedLabel, buttonLabels } = info;

  return (
    <div
      className={
        isLargeScreen
          ? "hidden"
          : isOpen
          ? "flex justify-end items-center py-1 px-2"
          : "flex justify-between items-center py-1 px-2"
      }
    >
      {!isOpen && <span className="text-gray-600">{closedLabel}</span>}
      <button
        onClick={onToggle}
        className="bg-white text-blue-600 border border-blue-600 px-3 py-1 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        {isOpen ? buttonLabels.open : buttonLabels.closed}
      </button>
    </div>
  );
};

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 bg-white shadow rounded-lg">
      {/* Header */}
      <h2 className="text-3xl font-bold text-gray-800">
        Edit Patient{" "}
        <span className="text-sm text-gray-500">#{formData.id}</span>
      </h2>

      {(basicDetails  ||  isLargeScreen) && (
        <div className="">
          {/* Patient Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

            <select
              name="purpose"
              required
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select Purpose</option>
              <option value="eye-test">Eye Test</option>
              <option value="frame-selection">Frame Selection</option>
              <option value="consultation">Consultation</option>
            </select>
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


{/* basic details togal */}
{renderToggleSection(
  {
    isOpen: basicDetails,
    onToggle: () => setbasicDetails(!basicDetails),
    closedLabel: "Basic details",
    buttonLabels: { open: "Hide Details", closed: "Basic Details" },
  },
  isLargeScreen
)}


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
                className="border py-4 rounded w-full focus:ring-2 focus:ring-blue-400 focus:outline-none"

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
      {/*Prescription Details Toggle */}   
{renderToggleSection(
  {
    isOpen: someDetails,
    onToggle: () => setSomeDetails(!someDetails),
    closedLabel: "Prescription details",
    buttonLabels: { open: "Hide Details", closed: "Show Details" },
  },
  isLargeScreen
)}

      {/* Vision Details */}

      {(isLargeScreen || showVisionDetails) && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">
            Vision Details
          </h3>

          {/* Right Eye Vision */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
            {/* Right Eye - Unaided Distance */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">R-Unaided Distance</label>
              <input
                type="text"
                list="rightEyeUnaidedDistanceOptions"
                name="vision.rightEye.unaidedDistance"
                value={formData.vision?.rightEye?.unaidedDistance || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "vision.rightEye.unaidedDistance",
                    e.target.value
                  )
                }
                placeholder="Select or enter value"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
              <datalist id="rightEyeUnaidedDistanceOptions">
                <option value="6/6" />
                <option value="6/9" />
                <option value="6/12" />
                <option value="6/18" />
                <option value="6/24" />
                <option value="6/36" />
                <option value="6/60" />
              </datalist>
            </div>

            {/* Right Eye - Unaided Near */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">R-Unaided Near</label>
              <input
                type="text"
                list="rightEyeUnaidedNearOptions"
                name="vision.rightEye.unaidedNear"
                value={formData.vision?.rightEye?.unaidedNear || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "vision.rightEye.unaidedNear",
                    e.target.value
                  )
                }
                placeholder="Select or enter value"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
              <datalist id="rightEyeUnaidedNearOptions">
                <option value="N5" />
                <option value="N6" />
                <option value="N8" />
                <option value="N10" />
                <option value="N12" />
              </datalist>
            </div>

            {/* Right Eye - Best Corrected Distance */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">
                R-Best Corrected Distance
              </label>
              <input
                type="text"
                list="rightEyeBestCorrectedDistanceOptions"
                name="vision.rightEye.bestCorrectedDistance"
                value={formData.vision?.rightEye?.bestCorrectedDistance || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "vision.rightEye.bestCorrectedDistance",
                    e.target.value
                  )
                }
                placeholder="Select or enter value"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
              <datalist id="rightEyeBestCorrectedDistanceOptions">
                <option value="6/6" />
                <option value="6/9" />
                <option value="6/12" />
                <option value="6/18" />
                <option value="6/24" />
                <option value="6/36" />
              </datalist>
            </div>

            {/* Right Eye - Best Corrected Near */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">R-Best Corrected Near</label>
              <input
                type="text"
                list="rightEyeBestCorrectedNearOptions"
                name="vision.rightEye.bestCorrectedNear"
                value={formData.vision?.rightEye?.bestCorrectedNear || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "vision.rightEye.bestCorrectedNear",
                    e.target.value
                  )
                }
                placeholder="Select or enter value"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
              <datalist id="rightEyeBestCorrectedNearOptions">
                <option value="N5" />
                <option value="N6" />
                <option value="N8" />
                <option value="N10" />
                <option value="N12" />
              </datalist>
            </div>
          </div>

          {/* Left Eye Vision */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
            
            {/* Left Eye - Unaided Distance */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">L-Unaided Distance</label>
              <input
                type="text"
                list="leftEyeUnaidedDistanceOptions"
                name="vision.leftEye.unaidedDistance"
                value={formData.vision?.leftEye?.unaidedDistance || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "vision.leftEye.unaidedDistance",
                    e.target.value
                  )
                }
                placeholder="Select or enter value"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
              <datalist id="leftEyeUnaidedDistanceOptions">
                <option value="6/6" />
                <option value="6/9" />
                <option value="6/12" />
                <option value="6/18" />
                <option value="6/24" />
                <option value="6/36" />
                <option value="6/60" />
              </datalist>
            </div>

            {/* Left Eye - Unaided Near */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">L-Unaided Near</label>
              <input
                type="text"
                list="leftEyeUnaidedNearOptions"
                name="vision.leftEye.unaidedNear"
                value={formData.vision?.leftEye?.unaidedNear || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "vision.leftEye.unaidedNear",
                    e.target.value
                  )
                }
                placeholder="Select or enter value"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
              <datalist id="leftEyeUnaidedNearOptions">
                <option value="N5" />
                <option value="N6" />
                <option value="N8" />
                <option value="N10" />
                <option value="N12" />
              </datalist>
            </div>

            {/* Left Eye - Best Corrected Distance */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">
                L-Best Corrected Distance
              </label>
              <input
                type="text"
                list="leftEyeBestCorrectedDistanceOptions"
                name="vision.leftEye.bestCorrectedDistance"
                value={formData.vision?.leftEye?.bestCorrectedDistance || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "vision.leftEye.bestCorrectedDistance",
                    e.target.value
                  )
                }
                placeholder="Select or enter value"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
              <datalist id="leftEyeBestCorrectedDistanceOptions">
                <option value="6/6" />
                <option value="6/9" />
                <option value="6/12" />
                <option value="6/18" />
                <option value="6/24" />
                <option value="6/36" />
              </datalist>
            </div>

            {/* Left Eye - Best Corrected Near */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">L-Best Corrected Near</label>
              <input
                type="text"
                list="leftEyeBestCorrectedNearOptions"
                name="vision.leftEye.bestCorrectedNear"
                value={formData.vision?.leftEye?.bestCorrectedNear || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "vision.leftEye.bestCorrectedNear",
                    e.target.value
                  )
                }
                placeholder="Select or enter value"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
              <datalist id="leftEyeBestCorrectedNearOptions">
                <option value="N5" />
                <option value="N6" />
                <option value="N8" />
                <option value="N10" />
                <option value="N12" />
              </datalist>
            </div>
          </div>
        </div>
      )}

      {/* Vision Details Toggle */}
{renderToggleSection(
  {
    isOpen: showVisionDetails,
    onToggle: () => setShowVisionDetails(!showVisionDetails),
    closedLabel: "Vision details",
    buttonLabels: { open: "Hide Details", closed: "Show Details" },
  },
  isLargeScreen
)}


      {/* Exam Details */}
      {(isLargeScreen || showExamDetails) && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">Exam Details</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
            {/* Adnexa */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">Adnexa</label>
              <input
                type="text"
                list="adnexaOptions"
                name="examDetails.adnexa"
                value={formData.examDetails?.adnexa || ""}
                onChange={(e) =>
                  handleNestedChange("examDetails.adnexa", e.target.value)
                }
                placeholder="Select or enter value"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
              <datalist id="adnexaOptions">
                <option value="Normal" />
                <option value="Swelling" />
                <option value="Discharge" />
                <option value="Redness" />
              </datalist>
            </div>

            {/* Conjunctiva */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">Conjunctiva</label>
              <input
                type="text"
                list="conjunctivaOptions"
                name="examDetails.conjunctiva"
                value={formData.examDetails?.conjunctiva || ""}
                onChange={(e) =>
                  handleNestedChange("examDetails.conjunctiva", e.target.value)
                }
                placeholder="Select or enter value"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
              <datalist id="conjunctivaOptions">
                <option value="Normal" />
                <option value="Congested" />
                <option value="Pale" />
                <option value="Injected" />
              </datalist>
            </div>

            {/* Cornea */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">Cornea</label>
              <input
                type="text"
                list="corneaOptions"
                name="examDetails.cornea"
                value={formData.examDetails?.cornea || ""}
                onChange={(e) =>
                  handleNestedChange("examDetails.cornea", e.target.value)
                }
                placeholder="Select or enter value"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
              <datalist id="corneaOptions">
                <option value="Clear" />
                <option value="Opacity" />
                <option value="Edema" />
              </datalist>
            </div>

            {/* Anterior Chamber */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">Anterior Chamber</label>
              <input
                type="text"
                list="anteriorChamberOptions"
                name="examDetails.anteriorChamber"
                value={formData.examDetails?.anteriorChamber || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "examDetails.anteriorChamber",
                    e.target.value
                  )
                }
                placeholder="Select or enter value"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
              <datalist id="anteriorChamberOptions">
                <option value="Normal" />
                <option value="Shallow" />
                <option value="Deep" />
                <option value="Cells/Flare" />
              </datalist>
            </div>

            {/* Iris */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">Iris</label>
              <input
                type="text"
                list="irisOptions"
                name="examDetails.iris"
                value={formData.examDetails?.iris || ""}
                onChange={(e) =>
                  handleNestedChange("examDetails.iris", e.target.value)
                }
                placeholder="Select or enter value"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
              <datalist id="irisOptions">
                <option value="Normal" />
                <option value="Atrophy" />
                <option value="Neovascularization" />
              </datalist>
            </div>

            {/* Lens */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">Lens</label>
              <input
                type="text"
                list="lensOptions"
                name="examDetails.lens"
                value={formData.examDetails?.lens || ""}
                onChange={(e) =>
                  handleNestedChange("examDetails.lens", e.target.value)
                }
                placeholder="Select or enter value"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
              <datalist id="lensOptions">
                <option value="Clear" />
                <option value="Cataract" />
                <option value="Pseudophakia" />
              </datalist>
            </div>

            {/* Fundus */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">Fundus</label>
              <input
                type="text"
                list="fundusOptions"
                name="examDetails.fundus"
                value={formData.examDetails?.fundus || ""}
                onChange={(e) =>
                  handleNestedChange("examDetails.fundus", e.target.value)
                }
                placeholder="Select or enter value"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
              <datalist id="fundusOptions">
                <option value="Normal" />
                <option value="Diabetic Retinopathy" />
                <option value="Hypertensive Retinopathy" />
                <option value="Macular Degeneration" />
              </datalist>
            </div>

            {/* Orbit */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">Orbit</label>
              <input
                type="text"
                list="orbitOptions"
                name="examDetails.orbit"
                value={formData.examDetails?.orbit || ""}
                onChange={(e) =>
                  handleNestedChange("examDetails.orbit", e.target.value)
                }
                placeholder="Select or enter value"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
              <datalist id="orbitOptions">
                <option value="Normal" />
                <option value="Mass" />
                <option value="Fracture" />
                <option value="Inflammation" />
              </datalist>
            </div>

            {/* Syringing */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">Syringing</label>
              <input
                type="text"
                list="syringingOptions"
                name="examDetails.syringing"
                value={formData.examDetails?.syringing || ""}
                onChange={(e) =>
                  handleNestedChange("examDetails.syringing", e.target.value)
                }
                placeholder="Select or enter value"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
              <datalist id="syringingOptions">
                <option value="Patent" />
                <option value="Blocked" />
                <option value="Partial Block" />
              </datalist>
            </div>

            {/* Vitreous */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">Vitreous</label>
              <input
                type="text"
                list="vitreousOptions"
                name="examDetails.vitreous"
                value={formData.examDetails?.vitreous || ""}
                onChange={(e) =>
                  handleNestedChange("examDetails.vitreous", e.target.value)
                }
                placeholder="Select or enter value"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
              <datalist id="vitreousOptions">
                <option value="Clear" />
                <option value="Floaters" />
                <option value="Hemorrhage" />
              </datalist>
            </div>
          </div>
        </div>
      )}

      {/* Exam Details Toggle */}
{renderToggleSection(
  {
    isOpen: showExamDetails,
    onToggle: () => setShowExamDetails(!showExamDetails),
    closedLabel: "Write Report",
    buttonLabels: { open: "Hide Details", closed: "Show Details" },
  },
  isLargeScreen
)}


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
              list="useOptions"
              name="glassesPrescription.use"
              value={formData.glassesPrescription?.use || ""}
              onChange={(e) =>
                handleNestedChange("glassesPrescription.use", e.target.value)
              }
              placeholder="Select or enter use"
              className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
            />
            <datalist id="useOptions">
              <option value="Distance" />
              <option value="Near" />
              <option value="Bifocal" />
              <option value="Progressive" />
            </datalist>
          </div>

          {/* Right Eye Glasses Prescription */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* SPH */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">R-SPH</label>
              <input
                type="text"
                list="sphOptions"
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

            {/* CYL */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">R-CYL</label>
              <input
                type="text"
                list="cylOptions"
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

            {/* Axis */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">R-Axis</label>
              <input
                type="text"
                list="axisOptions"
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
              <datalist id="axisOptions">
                {Array.from({ length: 180 }, (_, i) => (
                  <option key={i + 1} value={i + 1} />
                ))}
              </datalist>
            </div>

            {/* Prism */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">R-Prism</label>
              <input
                type="text"
                list="prismOptions"
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
              <datalist id="prismOptions">
                <option value="1Δ" />
                <option value="2Δ" />
                <option value="3Δ" />
                <option value="4Δ" />
              </datalist>
            </div>

            {/* V_A */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">R-V_A</label>
              <input
                type="text"
                list="vaOptions"
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

            {/* N_V */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">R-N_V</label>
              <input
                type="text"
                list="nvOptions"
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* SPH */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">L-SPH</label>
              <input
                type="text"
                list="sphOptions"
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

            {/* CYL */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">L-CYL</label>
              <input
                type="text"
                list="cylOptions"
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

            {/* Axis */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">L-Axis</label>
              <input
                type="text"
                list="axisOptions"
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

            {/* Prism */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">L-Prism</label>
              <input
                type="text"
                list="prismOptions"
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

            {/* V_A */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">L-V_A</label>
              <input
                type="text"
                list="vaOptions"
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

            {/* N_V */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">L-N_V</label>
              <input
                type="text"
                list="nvOptions"
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

          {/* Common Datalists */}
          <datalist id="sphOptions">
            <option value="+0.25" />
            <option value="+0.50" />
            <option value="-0.25" />
            <option value="-0.50" />
            <option value="-1.00" />
            <option value="-2.00" />
            <option value="-3.00" />
          </datalist>

          <datalist id="cylOptions">
            <option value="0.00" />
            <option value="-0.25" />
            <option value="-0.50" />
            <option value="-0.75" />
            <option value="-1.00" />
            <option value="-2.00" />
          </datalist>

          <datalist id="vaOptions">
            <option value="6/6" />
            <option value="6/9" />
            <option value="6/12" />
            <option value="6/18" />
            <option value="6/24" />
            <option value="6/36" />
          </datalist>

          <datalist id="nvOptions">
            <option value="N5" />
            <option value="N6" />
            <option value="N8" />
            <option value="N10" />
          </datalist>
        </div>
      )}

      {/* Glasses Prescription Toggle */}
{renderToggleSection(
  {
    isOpen: showGlassesPrescription,
    onToggle: () => setShowGlassesPrescription(!showGlassesPrescription),
    closedLabel: "Write Prescription",
    buttonLabels: { 
      open: "Hide Details", 
      closed: "Show Details" 
    },
  },
  isLargeScreen
)}


      {/* IOP Pachy CCT */}
      {(isLargeScreen || showIopPachyCCT) && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-700">IOP Pachy CCT</h3>

          {/* Right Eye IOP Pachy CCT */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
            {/* IOP */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">R-IOP</label>
              <input
                type="text"
                list="iopOptions"
                name="iopPachyCCT.rightEye.iop"
                value={formData.iopPachyCCT?.rightEye?.iop || ""}
                onChange={(e) =>
                  handleNestedChange("iopPachyCCT.rightEye.iop", e.target.value)
                }
                placeholder="IOP (mmHg)"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Corrected IOP */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">R-Corrected IOP</label>
              <input
                type="text"
                list="iopOptions"
                name="iopPachyCCT.rightEye.correctedIop"
                value={formData.iopPachyCCT?.rightEye?.correctedIop || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "iopPachyCCT.rightEye.correctedIop",
                    e.target.value
                  )
                }
                placeholder="Corrected IOP (mmHg)"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* CCT */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">R-CCT</label>
              <input
                type="text"
                list="cctOptions"
                name="iopPachyCCT.rightEye.cct"
                value={formData.iopPachyCCT?.rightEye?.cct || ""}
                onChange={(e) =>
                  handleNestedChange("iopPachyCCT.rightEye.cct", e.target.value)
                }
                placeholder="CCT (µm)"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Left Eye IOP Pachy CCT */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4">
            {/* IOP */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">L-IOP</label>
              <input
                type="text"
                list="iopOptions"
                name="iopPachyCCT.leftEye.iop"
                value={formData.iopPachyCCT?.leftEye?.iop || ""}
                onChange={(e) =>
                  handleNestedChange("iopPachyCCT.leftEye.iop", e.target.value)
                }
                placeholder="IOP (mmHg)"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Corrected IOP */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">L-Corrected IOP</label>
              <input
                type="text"
                list="iopOptions"
                name="iopPachyCCT.leftEye.correctedIop"
                value={formData.iopPachyCCT?.leftEye?.correctedIop || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "iopPachyCCT.leftEye.correctedIop",
                    e.target.value
                  )
                }
                placeholder="Corrected IOP (mmHg)"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* CCT */}
            <div className="flex flex-col">
              <label className="font-medium mb-1">L-CCT</label>
              <input
                type="text"
                list="cctOptions"
                name="iopPachyCCT.leftEye.cct"
                value={formData.iopPachyCCT?.leftEye?.cct || ""}
                onChange={(e) =>
                  handleNestedChange("iopPachyCCT.leftEye.cct", e.target.value)
                }
                placeholder="CCT (µm)"
                className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Common Datalists */}
          <datalist id="iopOptions">
            <option value="10" />
            <option value="12" />
            <option value="14" />
            <option value="16" />
            <option value="18" />
            <option value="20" />
            <option value="22" />
            <option value="24" />
            <option value="26" />
            <option value="28" />
          </datalist>

          <datalist id="cctOptions">
            <option value="480" />
            <option value="500" />
            <option value="520" />
            <option value="540" />
            <option value="560" />
            <option value="580" />
            <option value="600" />
            <option value="620" />
          </datalist>
        </div>
      )}

      {/* IOP Pachy CCT Toggle */}
{renderToggleSection(
  {
    isOpen: showIopPachyCCT,
    onToggle: () => setShowIopPachyCCT(!showIopPachyCCT),
    closedLabel: "Update IOP",
    buttonLabels: { 
      open: "Hide Details", 
      closed: "Show Details" 
    },
  },
  isLargeScreen
)}


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
              handleNestedChange("diagnosis", [
                ...(formData.diagnosis || []),
                "",
              ])
            }
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
          >
            Add Diagnosis
          </button>
        </div>
      )}

      {/* Diagnosis Toggle */}
{renderToggleSection(
  {
    isOpen: showDiagnosis,
    onToggle: () => setShowDiagnosis(!showDiagnosis),
    closedLabel: "Diagnosis",
    buttonLabels: { 
      open: "Hide Details", 
      closed: "Show Details" 
    },
  },
  isLargeScreen
)}


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
