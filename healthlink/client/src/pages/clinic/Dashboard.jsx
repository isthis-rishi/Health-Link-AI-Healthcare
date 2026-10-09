import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAppointmentsByClinic, getEmergenciesByClinic, updateAppointmentStatus, updateEmergencyStatus, listenToEmergencies } from "../../services/database";
import { FiAlertTriangle, FiCalendar, FiCheckCircle, FiX, FiClock, FiUser, FiPhone, FiMapPin, FiBell } from "react-icons/fi";
import toast from "react-hot-toast";

const ClinicDashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("emergencies");

  useEffect(() => {
    fetchData();
    const unsubscribe = listenToEmergencies(currentUser.uid, (liveEmergencies) => {
      setEmergencies(liveEmergencies);
      if (liveEmergencies.length > 0) {
        toast("New emergency alert!", { icon: "🚨", duration: 5000 });
      }
    });
    return () => unsubscribe();
  }, [currentUser]);

  const fetchData = async () => {
    try {
      const [apts, emgs] = await Promise.all([
        getAppointmentsByClinic(currentUser.uid),
        getEmergenciesByClinic(currentUser.uid)
      ]);
      setAppointments(apts);
      setEmergencies(emgs);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  const handleAppointment = async (id, status) => {
    try {
      await updateAppointmentStatus(id, status);
      toast.success(`Appointment ${status}`);
      fetchData();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const handleEmergency = async (id, status) => {
    try {
      await updateEmergencyStatus(id, status);
      toast.success(`Emergency ${status}`);
      fetchData();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    completed: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-700"
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {userProfile?.clinicName || "Clinic"} Dashboard
        </h1>
        <p className="text-sm text-gray-500">{userProfile?.clinicAddress || ""}</p>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <FiAlertTriangle className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{emergencies.filter(e => e.status === "triggered").length}</p>
          <p className="text-sm text-gray-500">Active Emergencies</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center">
              <FiClock className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{appointments.filter(a => a.status === "pending").length}</p>
          <p className="text-sm text-gray-500">Pending Appointments</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <FiCheckCircle className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{appointments.filter(a => a.status === "confirmed").length}</p>
          <p className="text-sm text-gray-500">Confirmed Today</p>
        </div>
      </div>
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
        {[
          { key: "emergencies", label: "Emergencies", icon: <FiAlertTriangle className="w-4 h-4" />, count: emergencies.length },
          { key: "appointments", label: "Appointments", icon: <FiCalendar className="w-4 h-4" />, count: appointments.length }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === tab.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.icon} {tab.label}
            {tab.count > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                tab.key === "emergencies" && tab.count > 0 ? "bg-red-500 text-white" : "bg-gray-200 text-gray-600"
              }`}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>
      {activeTab === "emergencies" && (
        <div className="space-y-3">
          {emergencies.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <FiCheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No active emergencies</p>
            </div>
          ) : (
            emergencies.map((emg) => (
              <div key={emg.id} className={`bg-white rounded-2xl border-2 p-5 ${
                emg.status === "triggered" ? "border-red-300 bg-red-50/30" : "border-gray-100"
              }`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {emg.status === "triggered" && (
                        <span className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold animate-pulse">
                          <FiBell className="w-3 h-3" /> ACTIVE
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        {emg.createdAt?.toDate ? emg.createdAt.toDate().toLocaleString() : "Just now"}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                      <div className="flex items-center gap-2">
                        <FiUser className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{emg.patientName || "Unknown"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiPhone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">{emg.patientPhone || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FiMapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-700">
                          {emg.location ? `${emg.location.lat?.toFixed(4)}, ${emg.location.lng?.toFixed(4)}` : "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs">Blood:</span>
                        <span className="text-gray-700 font-medium">{emg.bloodGroup || "N/A"}</span>
                      </div>
                    </div>
                    {emg.symptoms && (
                      <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-2 rounded-lg">
                        Symptoms: {emg.symptoms}
                      </p>
                    )}
                  </div>
                </div>
                {emg.status === "triggered" && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEmergency(emg.id, "responding")}
                      className="flex-1 py-2.5 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition"
                    >
                      Accept & Respond
                    </button>
                    <button
                      onClick={() => handleEmergency(emg.id, "resolved")}
                      className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition"
                    >
                      Resolve
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
      {activeTab === "appointments" && (
        <div className="space-y-3">
          {appointments.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <FiCalendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No appointments yet</p>
            </div>
          ) : (
            appointments.map((apt) => (
              <div key={apt.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{apt.patientName || "Patient"}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><FiCalendar className="w-3.5 h-3.5" /> {apt.date}</span>
                      <span className="flex items-center gap-1"><FiClock className="w-3.5 h-3.5" /> {apt.time}</span>
                      {apt.patientPhone && <span className="flex items-center gap-1"><FiPhone className="w-3.5 h-3.5" /> {apt.patientPhone}</span>}
                    </div>
                    {apt.reason && <p className="text-sm text-gray-400 mt-1">Reason: {apt.reason}</p>}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[apt.status] || "bg-gray-100"}`}>
                    {apt.status}
                  </span>
                </div>
                {apt.status === "pending" && (
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => handleAppointment(apt.id, "confirmed")}
                      className="px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-medium hover:bg-green-700 transition">
                      Confirm
                    </button>
                    <button onClick={() => handleAppointment(apt.id, "cancelled")}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-medium hover:bg-gray-200 transition">
                      Decline
                    </button>
                  </div>
                )}
                {apt.status === "confirmed" && (
                  <button onClick={() => handleAppointment(apt.id, "completed")}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-medium hover:bg-blue-700 transition">
                    Mark Completed
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ClinicDashboard;
