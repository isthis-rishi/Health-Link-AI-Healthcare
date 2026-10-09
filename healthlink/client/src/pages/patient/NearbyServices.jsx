import { useState, useEffect } from "react";
import { getAllClinics, getAllPharmacies } from "../../services/database";
import { FiMapPin, FiPhone, FiClock, FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";

const NearbyServices = () => {
  const [clinics, setClinics] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("clinics");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [c, p] = await Promise.all([getAllClinics(), getAllPharmacies()]);
        setClinics(c);
        setPharmacies(p);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredClinics = clinics.filter(c =>
    (c.clinicName || c.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.clinicAddress || c.address || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.specialties || []).join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const filteredPharmacies = pharmacies.filter(p =>
    (p.pharmacyName || p.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.pharmacyAddress || p.address || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Nearby Services</h1>
        <p className="text-sm text-gray-500">Find clinics and pharmacies registered on Health Link</p>
      </div>
      <div className="relative mb-4">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, address, or specialty..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
        {[
          { key: "clinics", label: `Clinics (${filteredClinics.length})` },
          { key: "pharmacies", label: `Pharmacies (${filteredPharmacies.length})` }
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === tab.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
            }`}>{tab.label}</button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-24 w-full" />)}</div>
      ) : activeTab === "clinics" ? (
        filteredClinics.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <FiMapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No clinics found</p>
            <p className="text-gray-400 text-xs mt-1">Clinics can register on Health Link to appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredClinics.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 card-hover">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{c.clinicName || c.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 flex items-start gap-1.5 mt-1">
                      <FiMapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> {c.clinicAddress || c.address || "Address not available"}
                    </p>
                    {c.phone && <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1"><FiPhone className="w-3 h-3" /> {c.phone}</p>}
                    {c.specialties && c.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {c.specialties.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md text-[11px] font-medium">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <Link to="/patient/appointments" className="px-3 py-2 bg-primary-600 text-white rounded-xl text-xs font-medium hover:bg-primary-700 transition flex-shrink-0">
                    Book
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        filteredPharmacies.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <FiMapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No pharmacies found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredPharmacies.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 card-hover">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">{p.pharmacyName || p.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 flex items-start gap-1.5 mt-1">
                      <FiMapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /> {p.pharmacyAddress || p.address || "Address not available"}
                    </p>
                    {p.phone && <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-1"><FiPhone className="w-3 h-3" /> {p.phone}</p>}
                    {p.inventory && p.inventory.length > 0 && (
                      <p className="text-[11px] text-emerald-600 font-medium mt-2">{p.inventory.length} medicines in stock</p>
                    )}
                  </div>
                  <Link to="/patient/prescriptions" className="px-3 py-2 bg-violet-600 text-white rounded-xl text-xs font-medium hover:bg-violet-700 transition flex-shrink-0">
                    Send Rx
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default NearbyServices;
