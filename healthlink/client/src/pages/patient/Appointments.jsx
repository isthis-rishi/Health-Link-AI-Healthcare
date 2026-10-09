import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { createAppointment, getAppointmentsByPatient, getAllClinics, updateAppointmentStatus } from "../../services/database";
import { FiCalendar, FiClock, FiMapPin, FiPlus, FiX, FiCheckCircle } from "react-icons/fi";
import toast from "react-hot-toast";

const Appointments = () => {
  const { currentUser, userProfile } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    clinicId: "",
    date: "",
    time: "",
    reason: ""
  });

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const fetchData = async () => {
    try {
      const [apts, cls] = await Promise.all([
        getAppointmentsByPatient(currentUser.uid),
        getAllClinics()
      ]);
      setAppointments(apts);
      setClinics(cls);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.clinicId || !form.date || !form.time) {
      return toast.error("Please fill all required fields");
    }
    setSubmitting(true);
    try {
      const selectedClinic = clinics.find(c => c.id === form.clinicId);
      await createAppointment({
        patientId: currentUser.uid,
        patientName: userProfile?.name || "Patient",
        patientPhone: userProfile?.phone || "",
        clinicId: form.clinicId,
        clinicName: selectedClinic?.clinicName || selectedClinic?.name || "Clinic",
        date: form.date,
        time: form.time,
        reason: form.reason
      });
      toast.success("Appointment booked successfully!");
      setShowForm(false);
      setForm({ clinicId: "", date: "", time: "", reason: "" });
      fetchData();
    } catch (error) {
      toast.error("Failed to book appointment");
    }
    setSubmitting(false);
  };

  const cancelAppointment = async (id) => {
    try {
      await updateAppointmentStatus(id, "cancelled");
      toast.success("Appointment cancelled");
      fetchData();
    } catch (error) {
      toast.error("Failed to cancel");
    }
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    completed: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-700"
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-sm text-gray-500">Book and manage your clinic appointments</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
            showForm ? "bg-gray-100 text-gray-600" : "bg-primary-600 text-white hover:bg-primary-700"
          }`}
        >
          {showForm ? <><FiX className="w-4 h-4" /> Cancel</> : <><FiPlus className="w-4 h-4" /> Book Appointment</>}
        </button>
      </div>
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 animate-fade-in">
          <h2 className="font-semibold text-gray-900 mb-4">Book New Appointment</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Clinic *</label>
              <select
                value={form.clinicId}
                onChange={(e) => setForm({ ...form, clinicId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500"
                required
              >
                <option value="">Choose a clinic...</option>
                {clinics.map(clinic => (
                  <option key={clinic.id} value={clinic.id}>
                    {clinic.clinicName || clinic.name} — {clinic.clinicAddress || clinic.address || ""}
                  </option>
                ))}
              </select>
              {clinics.length === 0 && (
                <p className="text-xs text-yellow-600 mt-1">No clinics registered yet. Ask a clinic to sign up first.</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  type="date"
                  value={form.date}
                  min={today}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
                <select
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Select time...</option>
                  {["09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
                    "12:00 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", "04:00 PM",
                    "04:30 PM", "05:00 PM", "05:30 PM"].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit</label>
              <textarea
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder="Brief description of your concern..."
                rows={2}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition disabled:opacity-50"
            >
              {submitting ? "Booking..." : "Confirm Appointment"}
            </button>
          </form>
        </div>
      )}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm">Loading appointments...</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <FiCalendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No appointments yet</p>
          <p className="text-gray-400 text-sm mt-1">Book your first appointment using the button above</p>
        </div>
      ) : (
        <div className="space-y-3">
          {appointments.map((apt) => (
            <div key={apt.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FiCalendar className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{apt.clinicName || "Clinic"}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <FiCalendar className="w-3.5 h-3.5" /> {apt.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock className="w-3.5 h-3.5" /> {apt.time}
                      </span>
                    </div>
                    {apt.reason && (
                      <p className="text-sm text-gray-400 mt-1">Reason: {apt.reason}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[apt.status] || "bg-gray-100"}`}>
                    {apt.status}
                  </span>
                  {apt.status === "pending" && (
                    <button
                      onClick={() => cancelAppointment(apt.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                      title="Cancel"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Appointments;
