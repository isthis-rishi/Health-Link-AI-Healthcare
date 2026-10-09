import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiHeart, FiShield, FiClock, FiMapPin, FiMessageSquare, FiAlertTriangle, FiPackage, FiArrowRight } from "react-icons/fi";

const Home = () => {
  const { userProfile } = useAuth();

  if (userProfile) {
    const dashboardMap = { patient: "/patient/dashboard", clinic: "/clinic/dashboard", pharmacy: "/pharmacy/dashboard" };
    return <Navigate to={dashboardMap[userProfile.role]} replace />;
  }

  return (
    <div className="min-h-screen bg-white">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
            <FiHeart className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Health Link</span>
        </div>
        <div className="flex gap-3">
          <Link to="/login" className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-50 rounded-xl transition">Sign In</Link>
          <Link to="/signup" className="px-5 py-2.5 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition">Get Started</Link>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-full text-sm font-medium mb-6">
          <FiShield className="w-4 h-4" /> Community Healthcare Platform
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Your Health, Connected.<br /><span className="text-primary-600">Anytime. Anywhere.</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          Health Link connects patients, clinics, and pharmacies through AI-powered symptom assessment, emergency SOS alerts, appointment booking, and prescription management.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/signup" className="px-8 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition text-lg flex items-center gap-2">
            Get Started Free <FiArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/login" className="px-8 py-4 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition text-lg">Sign In</Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Everything You Need in One Platform</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: <FiMessageSquare className="w-6 h-6" />, title: "Symptom Checker", desc: "Chat with our AI assistant to assess your symptoms and get instant triage recommendations — EMERGENCY, URGENT, ROUTINE, or SELF-CARE.", color: "bg-blue-50 text-blue-600" },
            { icon: <FiAlertTriangle className="w-6 h-6" />, title: "Emergency SOS", desc: "One-tap emergency button with 5-second countdown. Shares your location, medical info, and alerts the nearest registered clinic instantly.", color: "bg-red-50 text-red-600" },
            { icon: <FiClock className="w-6 h-6" />, title: "Appointment Booking", desc: "Browse registered clinics, pick a date and time, and book appointments directly. Clinics can confirm, reschedule, or complete visits.", color: "bg-green-50 text-green-600" },
            { icon: <FiMapPin className="w-6 h-6" />, title: "Real-Time Location", desc: "During emergencies, your GPS location is shared with the nearest clinic so help reaches you as fast as possible.", color: "bg-purple-50 text-purple-600" },
            { icon: <FiPackage className="w-6 h-6" />, title: "Prescription Management", desc: "Submit prescriptions to pharmacies, track validation status, and know when medicines are ready for pickup.", color: "bg-amber-50 text-amber-600" },
            { icon: <FiShield className="w-6 h-6" />, title: "Secure & Consent-Based", desc: "All health data is encrypted and shared only with your consent. Role-based access ensures the right people see the right data.", color: "bg-teal-50 text-teal-600" }
          ].map((feature, i) => (
            <div key={i} className="p-6 bg-white border border-gray-100 rounded-2xl hover:shadow-lg transition">
              <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">Three Portals, One Platform</h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">Health Link serves patients, clinics, and pharmacies — each with their own dedicated dashboard and tools.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { emoji: "\uD83E\uDDD1", title: "Patient Portal", features: ["Symptom Checker", "Emergency SOS Button", "Appointment Booking", "Prescription Tracking", "Health Info Dashboard"], color: "border-blue-200 bg-blue-50/50", btnColor: "bg-blue-600 hover:bg-blue-700" },
              { emoji: "\uD83C\uDFE5", title: "Clinic Portal", features: ["Real-Time Emergency Alerts", "Appointment Management", "Patient Info Access", "Confirm / Decline Visits", "Dashboard Analytics"], color: "border-green-200 bg-green-50/50", btnColor: "bg-green-600 hover:bg-green-700" },
              { emoji: "\uD83D\uDC8A", title: "Pharmacy Portal", features: ["Prescription Validation", "Inventory Management", "Stock & Price Tracking", "Order Status Updates", "Delivery Management"], color: "border-purple-200 bg-purple-50/50", btnColor: "bg-purple-600 hover:bg-purple-700" }
            ].map((portal, i) => (
              <div key={i} className={`p-6 rounded-2xl border-2 ${portal.color}`}>
                <span className="text-3xl">{portal.emoji}</span>
                <h3 className="text-lg font-bold text-gray-900 mt-3 mb-4">{portal.title}</h3>
                <ul className="space-y-2 mb-6">
                  {portal.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                      <FiArrowRight className="w-3 h-3 text-gray-400 flex-shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link to="/signup" className={`block text-center py-2.5 text-white text-sm font-medium rounded-xl transition ${portal.btnColor}`}>
                  Sign Up as {portal.title.replace(" Portal", "")}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">How Health Link Works</h2>
        <div className="space-y-6">
          {[
            { step: "1", title: "Patient Describes Symptoms", desc: "Open the Symptom Checker and describe what you're feeling. The AI asks focused follow-up questions." },
            { step: "2", title: "AI Assesses & Triages", desc: "Based on your responses, the AI provides a triage level: EMERGENCY, URGENT, ROUTINE, or SELF-CARE." },
            { step: "3", title: "Take Action", desc: "For emergencies, trigger the SOS button. For routine issues, book an appointment. For prescriptions, submit to a pharmacy." },
            { step: "4", title: "Clinics & Pharmacies Respond", desc: "Clinics receive real-time alerts and appointment requests. Pharmacies validate prescriptions and update availability." }
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-5">
              <div className="w-12 h-12 bg-primary-600 text-white rounded-2xl flex items-center justify-center text-lg font-bold flex-shrink-0">{item.step}</div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">{item.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary-600 py-16 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
        <p className="text-primary-100 mb-8 max-w-md mx-auto">Join Health Link today and experience AI-powered healthcare at your fingertips.</p>
        <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition text-lg">
          Create Free Account <FiArrowRight className="w-5 h-5" />
        </Link>
      </section>

      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center"><FiHeart className="w-4 h-4 text-white" /></div>
            <span className="font-bold text-gray-900">Health Link</span>
          </div>
          <p className="text-gray-400 text-sm">Community Healthcare Platform</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
