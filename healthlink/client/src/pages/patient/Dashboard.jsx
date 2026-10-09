import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getAppointmentsByPatient, getPrescriptionsByPatient, getSymptomChatsByPatient } from "../../services/database";
import { FiMessageSquare, FiAlertTriangle, FiCalendar, FiFileText, FiActivity, FiClock, FiChevronRight, FiHeart, FiDroplet, FiPhone, FiAlertCircle, FiMapPin, FiCreditCard } from "react-icons/fi";

const PatientDashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const [stats, setStats] = useState({ appointments: 0, prescriptions: 0, chats: 0 });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appointments, prescriptions, chats] = await Promise.all([
          getAppointmentsByPatient(currentUser.uid),
          getPrescriptionsByPatient(currentUser.uid),
          getSymptomChatsByPatient(currentUser.uid)
        ]);
        setStats({ appointments: appointments.length, prescriptions: prescriptions.length, chats: chats.length });
        setRecentAppointments(appointments.slice(0, 3));
      } catch (error) { console.error("Error:", error); }
      setLoading(false);
    };
    if (currentUser) fetchData();
  }, [currentUser]);

  const quickActions = [
    { to: "/patient/symptom-checker", icon: <FiMessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />, label: "Symptom Checker", desc: "Check symptoms", color: "from-blue-500 to-blue-600" },
    { to: "/patient/sos", icon: <FiAlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />, label: "Emergency SOS", desc: "Get help now", color: "from-red-500 to-red-600" },
    { to: "/patient/appointments", icon: <FiCalendar className="w-5 h-5 sm:w-6 sm:h-6" />, label: "Appointments", desc: "Book or view", color: "from-emerald-500 to-emerald-600" },
    { to: "/patient/prescriptions", icon: <FiFileText className="w-5 h-5 sm:w-6 sm:h-6" />, label: "Prescriptions", desc: "Upload & track", color: "from-violet-500 to-violet-600" },
    { to: "/patient/nearby", icon: <FiMapPin className="w-5 h-5 sm:w-6 sm:h-6" />, label: "Nearby", desc: "Find clinics", color: "from-amber-500 to-amber-600" },
    { to: "/patient/analytics", icon: <FiActivity className="w-5 h-5 sm:w-6 sm:h-6" />, label: "Analytics", desc: "Health insights", color: "from-cyan-500 to-cyan-600" },
    { to: "/patient/payment", icon: <FiCreditCard className="w-5 h-5 sm:w-6 sm:h-6" />, label: "Payments", desc: "Pay for meds", color: "from-pink-500 to-pink-600" },
  ];

  const statusColors = {
    pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    confirmed: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    completed: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    cancelled: "bg-red-50 text-red-700 ring-1 ring-red-200"
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-8">
      
      <div className="mb-6 sm:mb-8 animate-fade-in">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Welcome back, {userProfile?.name?.split(" ")[0] || "there"} <span className="inline-block animate-bounce">👋</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">Here's your health overview</p>
      </div>
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {[
          { label: "Appointments", value: stats.appointments, icon: <FiCalendar className="w-4 h-4 sm:w-5 sm:h-5" />, color: "text-emerald-600 bg-emerald-50" },
          { label: "Prescriptions", value: stats.prescriptions, icon: <FiFileText className="w-4 h-4 sm:w-5 sm:h-5" />, color: "text-violet-600 bg-violet-50" },
          { label: "Consultations", value: stats.chats, icon: <FiActivity className="w-4 h-4 sm:w-5 sm:h-5" />, color: "text-blue-600 bg-blue-50" },
        ].map((stat, i) => (
          <div key={i} className={`bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 card-hover animate-fade-in delay-${i + 1}`}>
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${stat.color} mb-2 sm:mb-3`}>
              {stat.icon}
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{loading ? <span className="skeleton inline-block w-8 h-6" /> : stat.value}</p>
            <p className="text-xs sm:text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {quickActions.map((action, i) => (
          <Link
            key={i}
            to={action.to}
            className={`bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 card-hover group animate-fade-in delay-${i + 1}`}
          >
            <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center text-white mb-2 sm:mb-3 group-hover:scale-110 transition-transform shadow-sm`}>
              {action.icon}
            </div>
            <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">{action.label}</h3>
            <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">{action.desc}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 animate-fade-in delay-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">Recent Appointments</h2>
            <Link to="/patient/appointments" className="text-xs sm:text-sm text-primary-600 hover:underline flex items-center gap-1">
              View all <FiChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2].map(i => <div key={i} className="skeleton h-16 w-full" />)}</div>
          ) : recentAppointments.length === 0 ? (
            <div className="text-center py-8 sm:py-10">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <FiCalendar className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-gray-400 text-sm font-medium">No appointments yet</p>
              <Link to="/patient/appointments" className="text-xs text-primary-600 hover:underline mt-2 inline-block">Book your first</Link>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-3 sm:p-3.5 bg-gray-50/80 rounded-xl hover:bg-gray-100/80 transition">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FiCalendar className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 text-sm truncate">{apt.clinicName || "Clinic"}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1"><FiClock className="w-3 h-3" /> {apt.date} at {apt.time}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex-shrink-0 ${statusColors[apt.status] || "bg-gray-100"}`}>
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 animate-fade-in delay-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Health Info</h2>
          <div className="space-y-4">
            {[
              { icon: <FiDroplet className="w-4 h-4" />, label: "Blood Group", value: userProfile?.bloodGroup || "Not set", color: "text-red-500 bg-red-50" },
              { icon: <FiAlertCircle className="w-4 h-4" />, label: "Allergies", value: userProfile?.allergies || "None", color: "text-amber-500 bg-amber-50" },
              { icon: <FiPhone className="w-4 h-4" />, label: "Emergency", value: userProfile?.emergencyContact || "Not set", color: "text-blue-500 bg-blue-50" },
              { icon: <FiHeart className="w-4 h-4" />, label: "Phone", value: userProfile?.phone || "Not set", color: "text-emerald-500 bg-emerald-50" },
            ].map((info, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${info.color} flex-shrink-0`}>
                  {info.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-gray-400 uppercase tracking-wide">{info.label}</p>
                  <p className="text-sm font-medium text-gray-900 truncate">{info.value}</p>
                </div>
              </div>
            ))}
          </div>
          <Link to="/profile" className="block mt-4 text-center py-2.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-xl hover:bg-gray-100 transition">
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
