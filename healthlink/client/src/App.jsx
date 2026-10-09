import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute, RoleRoute, PublicRoute } from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

import PatientDashboard from "./pages/patient/Dashboard";
import SymptomChecker from "./pages/patient/SymptomChecker";
import SOS from "./pages/patient/SOS";
import PatientAppointments from "./pages/patient/Appointments";
import PatientPrescriptions from "./pages/patient/Prescriptions";
import NearbyServices from "./pages/patient/NearbyServices";
import PredictiveAnalytics from "./pages/patient/PredictiveAnalytics";
import Payment from "./pages/patient/Payment";

import ClinicDashboard from "./pages/clinic/Dashboard";

import PharmacyDashboard from "./pages/pharmacy/Dashboard";

import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { borderRadius: "12px", background: "#1e293b", color: "#fff", fontSize: "14px" }
          }}
        />
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
            <Route path="/patient/dashboard" element={<ProtectedRoute><RoleRoute role="patient"><PatientDashboard /></RoleRoute></ProtectedRoute>} />
            <Route path="/patient/symptom-checker" element={<ProtectedRoute><RoleRoute role="patient"><SymptomChecker /></RoleRoute></ProtectedRoute>} />
            <Route path="/patient/sos" element={<ProtectedRoute><RoleRoute role="patient"><SOS /></RoleRoute></ProtectedRoute>} />
            <Route path="/patient/appointments" element={<ProtectedRoute><RoleRoute role="patient"><PatientAppointments /></RoleRoute></ProtectedRoute>} />
            <Route path="/patient/prescriptions" element={<ProtectedRoute><RoleRoute role="patient"><PatientPrescriptions /></RoleRoute></ProtectedRoute>} />
            <Route path="/patient/nearby" element={<ProtectedRoute><RoleRoute role="patient"><NearbyServices /></RoleRoute></ProtectedRoute>} />
            <Route path="/patient/analytics" element={<ProtectedRoute><RoleRoute role="patient"><PredictiveAnalytics /></RoleRoute></ProtectedRoute>} />
            <Route path="/patient/payments" element={<ProtectedRoute><RoleRoute role="patient"><Payment /></RoleRoute></ProtectedRoute>} />
            <Route path="/clinic/dashboard" element={<ProtectedRoute><RoleRoute role="clinic"><ClinicDashboard /></RoleRoute></ProtectedRoute>} />
            <Route path="/clinic/appointments" element={<ProtectedRoute><RoleRoute role="clinic"><ClinicDashboard /></RoleRoute></ProtectedRoute>} />
            <Route path="/clinic/emergencies" element={<ProtectedRoute><RoleRoute role="clinic"><ClinicDashboard /></RoleRoute></ProtectedRoute>} />
            <Route path="/pharmacy/dashboard" element={<ProtectedRoute><RoleRoute role="pharmacy"><PharmacyDashboard /></RoleRoute></ProtectedRoute>} />
            <Route path="/pharmacy/prescriptions" element={<ProtectedRoute><RoleRoute role="pharmacy"><PharmacyDashboard /></RoleRoute></ProtectedRoute>} />
            <Route path="/pharmacy/inventory" element={<ProtectedRoute><RoleRoute role="pharmacy"><PharmacyDashboard /></RoleRoute></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
