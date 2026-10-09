import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiLock, FiPhone, FiMapPin, FiHeart, FiClock } from "react-icons/fi";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient",
    phone: "",
    bloodGroup: "",
    allergies: "",
    emergencyContact: "",
    clinicName: "",
    clinicAddress: "",
    specialties: "",
    pharmacyName: "",
    pharmacyAddress: ""
  });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      const extraData = { phone: formData.phone };

      if (formData.role === "patient") {
        extraData.bloodGroup = formData.bloodGroup;
        extraData.allergies = formData.allergies;
        extraData.emergencyContact = formData.emergencyContact;
        extraData.medicalHistory = [];
      } else if (formData.role === "clinic") {
        extraData.clinicName = formData.clinicName;
        extraData.clinicAddress = formData.clinicAddress;
        extraData.specialties = formData.specialties.split(",").map(s => s.trim());
        extraData.doctors = [];
        extraData.timings = "9:00 AM - 6:00 PM";
      } else if (formData.role === "pharmacy") {
        extraData.pharmacyName = formData.pharmacyName;
        extraData.pharmacyAddress = formData.pharmacyAddress;
        extraData.inventory = [];
        extraData.timings = "8:00 AM - 10:00 PM";
      }

      await signup(formData.email, formData.password, formData.name, formData.role, extraData);
      toast.success("Account created successfully!");
      navigate("/");
    } catch (error) {
      const errorMessages = {
        "auth/email-already-in-use": "This email is already registered",
        "auth/weak-password": "Password is too weak",
        "auth/invalid-email": "Invalid email address"
      };
      toast.error(errorMessages[error.code] || "Signup failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
      <div className="w-full max-w-lg">
        
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-500 rounded-2xl mb-4">
            <FiHeart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-1">Join Health Link</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I am a</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: "patient", label: "Patient", icon: "🧑‍" },
                  { value: "clinic", label: "Clinic", icon: "🏥" },
                  { value: "pharmacy", label: "Pharmacy", icon: "💊" }
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: r.value })}
                    className={`py-3 px-2 rounded-xl border-2 text-center transition text-sm font-medium ${
                      formData.role === r.value
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-gray-200 hover:border-gray-300 text-gray-600"
                    }`}
                  >
                    <span className="text-xl block mb-1">{r.icon}</span>
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input type="text" name="name" value={formData.name} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm" placeholder="Your name" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm" placeholder="+91 XXXXX XXXXX" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input type="email" name="email" value={formData.email} onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm" placeholder="you@example.com" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input type="password" name="password" value={formData.password} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm" placeholder="Min 6 characters" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm" placeholder="Repeat password" required />
                </div>
              </div>
            </div>
            {formData.role === "patient" && (
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-500">Medical Information (Optional)</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                    <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm">
                      <option value="">Select</option>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                    <input type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm" placeholder="Contact number" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                  <input type="text" name="allergies" value={formData.allergies} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm" placeholder="e.g., Penicillin, Peanuts" />
                </div>
              </div>
            )}
            {formData.role === "clinic" && (
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-500">Clinic Details</p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Clinic Name</label>
                  <input type="text" name="clinicName" value={formData.clinicName} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm" placeholder="e.g., City Health Clinic" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input type="text" name="clinicAddress" value={formData.clinicAddress} onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm" placeholder="Full clinic address" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialties (comma-separated)</label>
                  <input type="text" name="specialties" value={formData.specialties} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm" placeholder="e.g., General, Pediatrics, Cardiology" />
                </div>
              </div>
            )}
            {formData.role === "pharmacy" && (
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-500">Pharmacy Details</p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pharmacy Name</label>
                  <input type="text" name="pharmacyName" value={formData.pharmacyName} onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm" placeholder="e.g., MedPlus Pharmacy" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input type="text" name="pharmacyAddress" value={formData.pharmacyAddress} onChange={handleChange}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm" placeholder="Full pharmacy address" required />
                  </div>
                </div>
              </div>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
