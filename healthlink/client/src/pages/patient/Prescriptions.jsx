import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { createPrescription, getPrescriptionsByPatient, getAllPharmacies } from "../../services/database";
import { FiFileText, FiPlus, FiX, FiCheckCircle, FiClock, FiAlertCircle } from "react-icons/fi";
import toast from "react-hot-toast";

const Prescriptions = () => {
  const { currentUser, userProfile } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    pharmacyId: "",
    medicines: "",
    notes: "",
    doctorName: ""
  });

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  const fetchData = async () => {
    try {
      const [presc, pharm] = await Promise.all([
        getPrescriptionsByPatient(currentUser.uid),
        getAllPharmacies()
      ]);
      setPrescriptions(presc);
      setPharmacies(pharm);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.medicines) return toast.error("Please enter medicines");
    setSubmitting(true);
    try {
      const selectedPharmacy = pharmacies.find(p => p.id === form.pharmacyId);
      await createPrescription({
        patientId: currentUser.uid,
        patientName: userProfile?.name || "Patient",
        patientPhone: userProfile?.phone || "",
        pharmacyId: form.pharmacyId || "",
        pharmacyName: selectedPharmacy?.pharmacyName || selectedPharmacy?.name || "Any nearby pharmacy",
        medicines: form.medicines.split(",").map(m => m.trim()),
        notes: form.notes,
        doctorName: form.doctorName
      });
      toast.success("Prescription submitted!");
      setShowForm(false);
      setForm({ pharmacyId: "", medicines: "", notes: "", doctorName: "" });
      fetchData();
    } catch (error) {
      toast.error("Failed to submit prescription");
    }
    setSubmitting(false);
  };

  const statusConfig = {
    uploaded: { color: "bg-yellow-100 text-yellow-700", icon: <FiClock className="w-3.5 h-3.5" />, label: "Pending Review" },
    validated: { color: "bg-green-100 text-green-700", icon: <FiCheckCircle className="w-3.5 h-3.5" />, label: "Validated" },
    ready: { color: "bg-blue-100 text-blue-700", icon: <FiCheckCircle className="w-3.5 h-3.5" />, label: "Ready for Pickup" },
    rejected: { color: "bg-red-100 text-red-700", icon: <FiAlertCircle className="w-3.5 h-3.5" />, label: "Rejected" },
    delivered: { color: "bg-gray-100 text-gray-600", icon: <FiCheckCircle className="w-3.5 h-3.5" />, label: "Delivered" }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Prescriptions</h1>
          <p className="text-sm text-gray-500">Submit and track your prescriptions</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition ${
            showForm ? "bg-gray-100 text-gray-600" : "bg-primary-600 text-white hover:bg-primary-700"
          }`}
        >
          {showForm ? <><FiX className="w-4 h-4" /> Cancel</> : <><FiPlus className="w-4 h-4" /> New Prescription</>}
        </button>
      </div>
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 animate-fade-in">
          <h2 className="font-semibold text-gray-900 mb-4">Submit Prescription</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medicines (comma-separated) *</label>
              <textarea
                value={form.medicines}
                onChange={(e) => setForm({ ...form, medicines: e.target.value })}
                placeholder="e.g., Paracetamol 500mg, Amoxicillin 250mg, Cetirizine 10mg"
                rows={2}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Doctor Name</label>
                <input
                  type="text"
                  value={form.doctorName}
                  onChange={(e) => setForm({ ...form, doctorName: e.target.value })}
                  placeholder="Dr. Name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Pharmacy</label>
                <select
                  value={form.pharmacyId}
                  onChange={(e) => setForm({ ...form, pharmacyId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Any nearby pharmacy</option>
                  {pharmacies.map(p => (
                    <option key={p.id} value={p.id}>{p.pharmacyName || p.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <input
                type="text"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Any special instructions..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-primary-600 text-white font-medium rounded-xl hover:bg-primary-700 transition disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Prescription"}
            </button>
          </form>
        </div>
      )}
      {loading ? (
        <div className="text-center py-12">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <FiFileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No prescriptions yet</p>
          <p className="text-gray-400 text-sm mt-1">Submit your first prescription above</p>
        </div>
      ) : (
        <div className="space-y-3">
          {prescriptions.map((p) => {
            const config = statusConfig[p.status] || statusConfig.uploaded;
            return (
              <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
                        {config.icon} {config.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(p.medicines || []).map((med, i) => (
                        <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-medium">
                          {med}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400">
                      {p.doctorName && `Dr. ${p.doctorName} • `}
                      {p.pharmacyName || "Any pharmacy"} •
                      {p.createdAt?.toDate ? ` ${p.createdAt.toDate().toLocaleDateString()}` : ""}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Prescriptions;
