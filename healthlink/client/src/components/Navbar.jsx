import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FiHeart, FiLogOut, FiUser, FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

const Navbar = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  if (!currentUser) return null;

  const roleConfig = {
    patient: { label: "Patient", color: "bg-blue-100 text-blue-700 ring-blue-200" },
    clinic: { label: "Clinic", color: "bg-emerald-100 text-emerald-700 ring-emerald-200" },
    pharmacy: { label: "Pharmacy", color: "bg-violet-100 text-violet-700 ring-violet-200" }
  };

  const navLinks = {
    patient: [
      { to: "/patient/dashboard", label: "Dashboard" },
      { to: "/patient/symptom-checker", label: "Symptom Checker" },
      { to: "/patient/sos", label: "SOS", highlight: true },
      { to: "/patient/appointments", label: "Appointments" },
      { to: "/patient/prescriptions", label: "Prescriptions" },
      { to: "/patient/payments", label: "Payments" },
      { to: "/patient/analytics", label: "Analytics" },
      { to: "/patient/nearby", label: "Nearby" }
    ],
    clinic: [
      { to: "/clinic/dashboard", label: "Dashboard" },
      { to: "/clinic/appointments", label: "Appointments" },
      { to: "/clinic/emergencies", label: "Emergencies" }
    ],
    pharmacy: [
      { to: "/pharmacy/dashboard", label: "Dashboard" },
      { to: "/pharmacy/prescriptions", label: "Prescriptions" },
      { to: "/pharmacy/inventory", label: "Inventory" }
    ]
  };

  const links = navLinks[userProfile?.role] || [];
  const role = roleConfig[userProfile?.role] || {};

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100/80 sticky top-0 z-50 safe-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-sm shadow-primary-200">
                <FiHeart className="w-[18px] h-[18px] text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 hidden sm:block tracking-tight">Health Link</span>
            </Link>
            <div className="hidden lg:flex items-center gap-0.5">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3.5 py-2 text-[13px] font-medium rounded-lg transition-all duration-200 ${
                    location.pathname === link.to
                      ? "bg-primary-50 text-primary-700"
                      : link.highlight
                        ? "text-red-600 hover:bg-red-50"
                        : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2">
              
              <span className={`hidden sm:inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold ring-1 ${role.color}`}>
                {role.label}
              </span>
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-2 pr-1.5 py-1.5 rounded-xl hover:bg-gray-50 transition"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                    <FiUser className="w-4 h-4 text-gray-500" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden md:block max-w-[120px] truncate">
                    {userProfile?.name || "User"}
                  </span>
                  <FiChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 animate-scale-in z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{userProfile?.name}</p>
                      <p className="text-xs text-gray-400 truncate">{userProfile?.email}</p>
                    </div>
                    <Link to="/profile" onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition">
                      <FiUser className="w-4 h-4" /> My Profile
                    </Link>
                    <button onClick={handleLogout}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition w-full text-left">
                      <FiLogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition"
              >
                {menuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>
      {menuOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setMenuOpen(false)} />
          <div className="fixed top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-xl z-40 lg:hidden animate-fade-in safe-bottom">
            <div className="px-4 py-3 space-y-1 max-h-[60vh] overflow-y-auto">
              {links.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition ${
                    location.pathname === link.to
                      ? "bg-primary-50 text-primary-700"
                      : link.highlight
                        ? "text-red-600 hover:bg-red-50"
                        : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-gray-100 pt-2 mt-2">
                <Link to="/profile" className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
                  My Profile
                </Link>
                <button onClick={handleLogout}
                  className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50">
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
