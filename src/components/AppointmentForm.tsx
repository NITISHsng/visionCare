import React, { useState } from "react";
import { initialPatient, PatientFullTypeWithObjectId } from "../contexts/type";
import toast from "react-hot-toast";
interface PatientFormProps {
  setShowBookingForm: React.Dispatch<React.SetStateAction<boolean>>;
  setBookingSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}

export const appointmentForm: React.FC<PatientFormProps> = ({
  setShowBookingForm,
  setBookingSuccess,
}) => {
  const [formValues, setFormValues] =
    useState<PatientFullTypeWithObjectId>(initialPatient);
  const [loading, setLoading] = useState(false);
  // handleChange updates state whenever an input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(formValues);
  };

  function generateAppointmentId() {
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2); // last 2 digits of year
    const mm = String(now.getMonth() + 1).padStart(2, "0"); // months 0-11
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");

    return `${yy}${mm}${dd}${hh}${min}${ss}`;
  }
  const handleBookAppointment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formValues.id = generateAppointmentId();
    setLoading(true);
    try {
      const res = await fetch("/api/appointment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      if (!res.ok) {
        throw new Error("Failed to book appointment");
      }
      const result = await res.json();
      toast.success("Appointment Booked Successfully");
      setLoading(false);
      setBookingSuccess(true);
      setShowBookingForm(false);
      setTimeout(() => setBookingSuccess(false), 5000);
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-3 md:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-2 md:mb-4">
          Book Appointment
        </h2>
        <form onSubmit={handleBookAppointment}>
          <div className="space-y-2 md:space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="ptName"
                required
                onChange={handleChange}
                className="w-full px-3 py-1 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age
              </label>
              <input
                type="number"
                name="age"
                required
                onChange={handleChange}
                className="w-full px-3 py-1 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNo"
                required
                onChange={handleChange}
                className="w-full px-3 py-1 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Date
              </label>
              <input
                type="date"
                name="preferredDate"
                required
                min={new Date().toISOString().split("T")[0]}
                onChange={handleChange}
                className="w-full px-3 py-1 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Preferred Time
  </label>

  <select
    name="preferredTime"
    onChange={handleChange}
    className="border p-3 rounded focus:ring-2 focus:ring-blue-400 w-full"
  >
    {Array.from({ length: 19 }, (_, i) => {
      const hour24 = 9 + Math.floor(i / 2);
      const minutes = i % 2 === 0 ? "00" : "30";
      const value = `${hour24.toString().padStart(2, "0")}:${minutes}`;

      // Convert to 12-hour format with AM/PM
      const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
      const ampm = hour24 < 12 ? "AM" : "PM";
      const label = `${hour12}:${minutes} ${ampm}`;

      return (
        <option key={value} value={value}>
          {label}
        </option>
      );
    })}
  </select>
</div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purpose
              </label>
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
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes (Optional)
              </label>
              <textarea
                name="notes"
                rows={3}
                onChange={handleChange}
                className="w-full px-3 py-1 md:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Any specific concerns or requirements..."
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={() => setShowBookingForm(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-70"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <span className="spin"></span>
                  <span>Booking...</span>
                </div>
              ) : (
                "Book Appointment"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default appointmentForm;
