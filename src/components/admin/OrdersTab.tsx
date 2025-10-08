import React, { useState } from "react";
import { Eye, Edit, Search } from "lucide-react";
import { PatientFullTypeWithObjectId } from "@/src/contexts/type";
import { useDashboardData } from "@/src/contexts/dataCollection";
import toast from "react-hot-toast";

export function OrdersTab() {
  const { patients ,fetchData} = useDashboardData();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState<PatientFullTypeWithObjectId | null>(
    null
  );

  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);

  const handleViewClick = (order: PatientFullTypeWithObjectId) => {
    setFormData(order);
    setIsPopupOpen(true);
  };

  const handleEditClick = (order: PatientFullTypeWithObjectId) => {
    setFormData({ ...order }); // Create a copy for editing
    setIsEditPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setFormData(null);
  };

  const handleCloseEditPopup = () => {
    setIsEditPopupOpen(false);
    setFormData(null);
  };

  
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (setFormData) {
      if (name.startsWith("glassesPrescription.")) {
        const [_, eye, field] = name.split(".");
        setFormData((prev) => ({
          ...prev!,
          glassesPrescription: {
            ...prev!.glassesPrescription,
            [eye]: {
              ...(prev!.glassesPrescription[
                eye as "leftEye" | "rightEye"
              ] as Record<string, any>),
              [field]: value,
            },
          },
        }));
      } else if (
        name.includes("total") ||
        name.includes("Price") ||
        name.includes("Advance") ||
        name.includes("Due")
      ) {
        setFormData((prev) => ({ ...prev!, [name]: parseFloat(value) }));
      } else {
        setFormData((prev) => ({ ...prev!, [name]: value }));
      }
    }
  };

  const [saving, setSaving] = useState(false);
  const handleSaveEdit = async () => {
    const id = formData?._id;
    try {
      setSaving(true);
      const updatedFormData = {
        ...formData,
        updatedAt: new Date().toISOString(),

        // Medicine Due
        medicineDue:
          (formData?.medicinePrice ?? 0) - (formData?.medicineAdvance ?? 0),

        // Total Amount
        totalAmount:
          (formData?.visitPrice ?? 0) +
          (formData?.medicinePrice ?? 0) +
          (formData?.framePrice ?? 0) +
          (formData?.lensePrice ?? 0),

        // Total Advance
        totalAdvance:
          (formData?.visitPrice ?? 0) +
          (formData?.medicineAdvance ?? 0) +
          (formData?.opticalAdvance ?? 0),

        // Total Due
        totalDue:
          (formData?.framePrice ?? 0) +
          (formData?.lensePrice ?? 0) -
          (formData?.opticalAdvance ?? 0) +
          ((formData?.medicinePrice ?? 0) - (formData?.medicineAdvance ?? 0)),

        // Optical Price
        opticalaPrice:
          (formData?.visitPrice ?? 0) + (formData?.lensePrice ?? 0),
      };

      if (!id) throw new Error("Missing patient ID");

      const res = await fetch(`/api/patient?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: id, ...updatedFormData }),
      });

      if (!res.ok) throw new Error("Failed to save");
      const data = await res.json();
      localStorage.setItem("activeTab", "orders");
      toast.success("Saved successfully!");
      fetchData();
      setIsEditPopupOpen(false);

    } catch (err) {
      console.error("Save failed:", err);
      toast.error("Failed to save");
    } finally {
      setSaving(false);
      console.log("Saving edited order:", formData);
      handleCloseEditPopup();
    }
  };

  // Placeholder for orders data - will be fetched from API later
  // const orders: PatientFullTypeWithObjectId[] = patients;

  const formatDateDisplay = (date: Date | string) => {
    const d = new Date(date); // handle string or Date object
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = String(d.getFullYear()); // last 2 digits
    return `${year}-${month}-${day}`;
  };

  const [searchTerm, setSearchTerm] = useState("");
  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  const [dateFilter, setDateFilter] = useState("");
  const [deliveryStatusFilter, setDeliveryStatusFilter] = useState(""); // ✅ new filter

  const orders = patients.filter((patient) => {
    const matchStatus =
      patient.ptName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phoneNo.includes(searchTerm) ||
      patient.billNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const filterByDeliveryStatus =
      deliveryStatusFilter === "" // show all
        ? true
        : deliveryStatusFilter === patient.deliveryStatus;

    const matchesDate =
      !dateFilter || formatDateDisplay(patient.visitDate) === dateFilter;
    return (
      matchStatus && filterByDeliveryStatus && matchesDate && patient.billNo
    );
  });

  return (
    <div className="p-2">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Orders Management
      </h2>
      <div className="bg-white rounded-lg p-2 md:p-5 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
          <div>
            <label className="hidden md:block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by name, phone, bill number, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 gap-1">
            <div>
              <label className="hidden md:block text-sm font-medium text-gray-700 mb-1">
                Delivery Status
              </label>
              <select
                name="deliveryStatus"
                value={deliveryStatusFilter}
                onChange={(e) => setDeliveryStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="inProgress">In Progress</option>
                <option value="readyToDeliver">Ready to Deliver</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

            <div>
              <label className="hidden md:block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Responsive Wrapper */}
        <div className="overflow-x-auto">
          <table className="min-w-[560px] md:min-w-full leading-normal w-full">
            <thead>
              <tr>
                <th className="px-2 md:px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Bill No
                </th>
                <th className="px-2 md:px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Pt-Name
                </th>
                <th className="px-2 md:px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Phone No
                </th>
                <th className="px-2 md:px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Due
                </th>
                <th className="px-2 md:px-4 py-2 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center px-2 md:px-4 text-gray-500 py-4"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.billNo}
                    className={`transition-colors ${
                      order.totalDue > 0
                        ? "bg-red-50"
                        : "bg-white text-gray-800"
                    } hover:bg-gray-50`}
                  >
                    <td className="px-2 md:px-4 py-2 border-b border-gray-200 text-sm font-medium">
                      {order.billNo}
                    </td>
                    <td className="px-2 md:px-4 py-2 border-b border-gray-200 text-sm">
                      {order.ptName}
                    </td>
                    <td className="px-2 md:px-4 py-2 border-b border-gray-200 text-sm">
                      {order.phoneNo}
                    </td>
                    <td
                      className={`px-2 md:px-4 py-2 border-b border-gray-200 text-sm font-semibold ${
                        order.totalDue > 0 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      ₹{order.totalDue}
                    </td>
                    <td className="px-2 md:px-4 py-2 border-b border-gray-200 text-sm text-center">
                      <div className="flex justify-center items-center space-x-3">
                        <button
                          onClick={() => handleViewClick(order)}
                          className="text-teal-600 hover:text-teal-900 focus:outline-none"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleEditClick(order)}
                          className="text-blue-600 hover:text-blue-900 focus:outline-none"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Popup/Modal for Order Details */}
      {isPopupOpen && formData && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative p-8 border w-full max-w-2xl md:max-w-3xl lg:max-w-4xl shadow-lg rounded-md bg-white">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Order Details (Bill No: {formData.billNo})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              {/* Patient Info */}
              <div>
                <p>
                  <strong>Patient Name:</strong> {formData.ptName}
                </p>
                <p>
                  <strong>Phone No:</strong> {formData.phoneNo}
                </p>
                <p>
                  <strong>Age:</strong> {formData.age}
                </p>
                <p>
                  <strong>Gender:</strong> {formData.gender}
                </p>
              </div>

              {/* Glasses Prescription */}
<div>
  <h4 className="font-semibold mt-2">Glasses Prescription:</h4>
  <p><strong>Use:</strong> {formData.glassesPrescription.use}</p>

  <p><strong>Right Eye SPH:</strong> {formData.glassesPrescription.rightEye.sph}</p>
  <p><strong>Right Eye CYL:</strong> {formData.glassesPrescription.rightEye.cyl || "N/A"}</p>
  <p><strong>Right Eye AXIS:</strong> {formData.glassesPrescription.rightEye.axis || "N/A"}</p>
  <p><strong>Right Eye Addition:</strong> {formData.glassesPrescription.rightEye.add || "N/A"}</p>
  <p><strong>Right Eye Prism:</strong> {formData.glassesPrescription.rightEye.prism || "N/A"}</p>
  <p><strong>Right Eye V.A:</strong> {formData.glassesPrescription.rightEye.V_A || "N/A"}</p>
  <p><strong>Right Eye N.V:</strong> {formData.glassesPrescription.rightEye.N_V || "N/A"}</p>

  <p><strong>Left Eye SPH:</strong> {formData.glassesPrescription.leftEye.sph}</p>
  <p><strong>Left Eye CYL:</strong> {formData.glassesPrescription.leftEye.cyl || "N/A"}</p>
  <p><strong>Left Eye AXIS:</strong> {formData.glassesPrescription.leftEye.axis || "N/A"}</p>
  <p><strong>Left Eye Addition:</strong> {formData.glassesPrescription.leftEye.add || "N/A"}</p>
  <p><strong>Left Eye Prism:</strong> {formData.glassesPrescription.leftEye.prism || "N/A"}</p>
  <p><strong>Left Eye V.A:</strong> {formData.glassesPrescription.leftEye.V_A || "N/A"}</p>
  <p><strong>Left Eye N.V:</strong> {formData.glassesPrescription.leftEye.N_V || "N/A"}</p>
</div>


              {/* Order Details */}
              <div>
                <h4 className="font-semibold mt-3 text-gray-800 border-b pb-1">
                  Order Information
                </h4>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2 text-sm text-gray-700">
                  <p>
                    <strong>Order Date:</strong>{" "}
                    {formData.orderDate
                      ? new Date(formData.orderDate).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                          }
                        )
                      : "N/A"}
                  </p>

                  <p>
                    <strong>Delivery Date:</strong>{" "}
                    {formData.deliveryDate
                      ? new Date(formData.deliveryDate).toLocaleDateString(
                          "en-GB",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "2-digit",
                          }
                        )
                      : "N/A"}
                  </p>
                </div>

                {/* Frame Details */}
                <div className="mt-3">
                  <h5 className="font-semibold text-blue-700">
                    Frame Details:
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-700">
                    <p>
                      <strong>Frame ID:</strong> {formData.frameId || "N/A"}
                    </p>
                    <p>
                      <strong>Frame Price:</strong> ₹{formData.framePrice || 0}
                    </p>
                  </div>
                </div>

                {/* Lens Details */}
                <div className="mt-3">
                  <h5 className="font-semibold text-blue-700">Lens Details:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-gray-700">
                    <p>
                      <strong>Lens ID:</strong> {formData.lenseId || "N/A"}
                    </p>
                    <p>
                      <strong>Lens Price:</strong> ₹{formData.lensePrice || 0}
                    </p>
                  </div>
                </div>
              </div>

              {/* Financials */}
              <div>
                <h4 className="font-semibold mt-2">Financial Summary:</h4>
                <p>
                  <strong>Total Amount:</strong> ₹{formData.totalAmount}
                </p>
                <p>
                  <strong>Total Advance:</strong> ₹{formData.totalAdvance}
                </p>
                <p>
                  <strong>Total Due:</strong> ₹
                  {formData.totalAmount - formData.totalAdvance}
                </p>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={handleClosePopup}
                className="px-4 py-2 bg-teal-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Popup/Modal for Order Details */}
      {isEditPopupOpen && formData && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex justify-center items-center">
          <div className="relative p-2 md:p-4 border w-full max-w-2xl md:max-w-3xl lg:max-w-4xl shadow-lg rounded-xl bg-white overflow-y-auto max-h-[95vh]">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Edit Order (Bill No: {formData.billNo})
            </h3>

            <div className="space-y-2">
              {/* 🧍 Basic Details */}
              {/* <section className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
                  Basic Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-medium mb-1 block">
                      Patient Name
                    </label>
                    <input
                      type="text"
                      name="ptName"
                      value={formData.ptName}
                      onChange={handleInputChange}
                      className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  <div>
                    <label className="font-medium mb-1 block">Phone No</label>
                    <input
                      type="text"
                      name="phoneNo"
                      value={formData.phoneNo}
                      onChange={handleInputChange}
                      className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  <div>
                    <label className="font-medium mb-1 block">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  <div>
                    <label className="font-medium mb-1 block">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="m">Male</option>
                      <option value="f">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </section> */}

              {/* 👓 Glasses Prescription */}
              {/* <section className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
                  Glasses Prescription
                </h3>

                <div className="flex flex-col max-w-sm">
                  <label className="font-medium mb-1">Use</label>
                  <input
                    type="text"
                    list="useOptions"
                    name="glassesPrescription.use"
                    value={formData.glassesPrescription?.use || ""}
                    onChange={(e) =>
                      handleNestedChange(
                        "glassesPrescription.use",
                        e.target.value
                      )
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

                
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-300 rounded-lg">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-3 py-2 text-left">
                          Parameter
                        </th>
                        <th className="border px-3 py-2 text-center">
                          Right Eye
                        </th>
                        <th className="border px-3 py-2 text-center">
                          Left Eye
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: "SPH", key: "sph" },
                        { label: "CYL", key: "cyl" },
                        { label: "Axis", key: "axis" },
                        { label: "Prism", key: "prism" },
                        { label: "V_A", key: "V_A" },
                        { label: "N_V", key: "N_V" },
                      ].map(({ label, key }) => (
                        <tr key={key} className="odd:bg-white even:bg-gray-50">
                          <td className="border px-3 py-2 font-medium">
                            {label}
                          </td>

                        
                          <td className="border px-3 py-2">
                            <input
                              type="text"
                              name={`glassesPrescription.rightEye.${key}`}
                              value={
                                (
                                  formData.glassesPrescription?.rightEye as any
                                )?.[key] ?? ""
                              }
                              onChange={(e) =>
                                handleNestedChange(
                                  `glassesPrescription.rightEye.${key}`,
                                  e.target.value
                                )
                              }
                              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400"
                            />
                          </td>

                          <td className="border px-3 py-2">
                            <input
                              type="text"
                              name={`glassesPrescription.leftEye.${key}`}
                              value={
                                (
                                  formData.glassesPrescription?.leftEye as any
                                )?.[key] ?? ""
                              }
                              onChange={(e) =>
                                handleNestedChange(
                                  `glassesPrescription.leftEye.${key}`,
                                  e.target.value
                                )
                              }
                              className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section> */}

              {/* 🛒 Order Information */}
              <section className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
                  Order Information
                </h3>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="font-medium mb-1 block">Order Date</label>
                    <input
                      type="date"
                      name="orderDate"
                      value={formData.orderDate.split("T")[0]}
                      onChange={handleInputChange}
                      className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  <div>
                    <label className="font-medium mb-1 block">
                      Delivery Date
                    </label>
                    <input
                      type="date"
                      name="deliveryDate"
                      value={formData.deliveryDate?.split("T")[0] || ""}
                      onChange={handleInputChange}
                      className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  <div>
                    <label className="font-medium mb-1 block">Frame ID</label>
                    <input
                      type="text"
                      name="frameId"
                      value={formData.frameId}
                      onChange={handleInputChange}
                      className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  <div>
                    <label className="font-medium mb-1 block">
                      Frame Price
                    </label>
                    <input
                      type="number"
                      name="framePrice"
                      value={formData.framePrice}
                      onChange={handleInputChange}
                      className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  <div>
                    <label className="font-medium mb-1 block">Lens ID</label>
                    <input
                      type="text"
                      name="lenseId"
                      value={formData.lenseId}
                      onChange={handleInputChange}
                      className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  <div>
                    <label className="font-medium mb-1 block">Lens Price</label>
                    <input
                      type="number"
                      name="lensePrice"
                      value={formData.lensePrice}
                      onChange={handleInputChange}
                      className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="font-medium mb-1 block">
                      Optical Price
                    </label>
                    <input
                      type="number"
                      name="opticalaPrice"
                      value={formData.lensePrice + formData.framePrice}
                      readOnly
                      className="border p-3 rounded w-full bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="font-medium mb-1 block">Pay</label>
                    <input
                      type="number"
                      name="opticalAdvance"
                      value={formData.opticalAdvance}
                      onChange={handleInputChange}
                      className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
              </section>

              {/* 💰 Financial Summary */}
              <section className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-700 border-b pb-2">
                  Financial Summary
                </h3>

                <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
                  <div>
                    <label className="font-medium mb-1 block">
                      Total Amount
                    </label>
                    <input
                      type="number"
                      name="totalAmount"
                      value={formData.totalAmount}
                      readOnly
                      className="border p-3 rounded w-full bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="font-medium mb-1 block">
                      Total Advance
                    </label>
                    <input
                      type="number"
                      name="totalAdvance"
                      value={formData.totalAdvance}
                      readOnly
                      className="border p-3 rounded w-full bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="font-medium mb-1 block">Total Due</label>
                    <input
                      type="number"
                      name="totalDue"
                      value={formData.totalDue}
                      readOnly
                      className="border p-3 rounded w-full bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-8 space-x-4">
              <button
                onClick={handleCloseEditPopup}
                className="px-4 py-2 bg-gray-300 text-gray-800 font-medium rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
