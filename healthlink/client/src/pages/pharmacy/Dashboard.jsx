import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getPrescriptionsByPharmacy, updatePrescriptionStatus, updateUserProfile } from "../../services/database";
import { FiFileText, FiCheckCircle, FiX, FiClock, FiPackage, FiUser, FiPhone, FiPlus, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";

const PharmacyDashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("prescriptions");
  const [inventory, setInventory] = useState(userProfile?.inventory || []);
  const [newMedicine, setNewMedicine] = useState({ name: "", stock: "", price: "" });

  useEffect(() => {
    fetchData();
  }, [currentUser]);

  useEffect(() => {
    setInventory(userProfile?.inventory || []);
  }, [userProfile]);

  const fetchData = async () => {
    try {
      const presc = await getPrescriptionsByPharmacy(currentUser.uid);
      setPrescriptions(presc);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  const handlePrescription = async (id, status) => {
    try {
      await updatePrescriptionStatus(id, status);
      toast.success(`Prescription ${status}`);
      fetchData();
    } catch (error) {
      toast.error("Action failed");
    }
  };

  const addMedicine = async () => {
    if (!newMedicine.name || !newMedicine.stock) return toast.error("Enter medicine name and stock");
    const updated = [...inventory, { ...newMedicine, id: Date.now().toString(), stock: parseInt(newMedicine.stock), price: parseFloat(newMedicine.price) || 0 }];
    setInventory(updated);
    try {
      await updateUserProfile(currentUser.uid, { inventory: updated });
      toast.success("Medicine added");
      setNewMedicine({ name: "", stock: "", price: "" });
    } catch (error) {
      toast.error("Failed to update inventory");
    }
  };

  const removeMedicine = async (id) => {
    const updated = inventory.filter(m => m.id !== id);
    setInventory(updated);
    try {
      await updateUserProfile(currentUser.uid, { inventory: updated });
      toast.success("Medicine removed");
    } catch (error) {
      toast.error("Failed to update");
    }
  };

  const statusConfig = {
    uploaded: { color: "bg-yellow-100 text-yellow-700", label: "Pending Review" },
    validated: { color: "bg-green-100 text-green-700", label: "Validated" },
    ready: { color: "bg-blue-100 text-blue-700", label: "Ready" },
    rejected: { color: "bg-red-100 text-red-700", label: "Rejected" },
    delivered: { color: "bg-gray-100 text-gray-600", label: "Delivered" }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {userProfile?.pharmacyName || "Pharmacy"} Dashboard
        </h1>
        <p className="text-sm text-gray-500">{userProfile?.pharmacyAddress || ""}</p>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-2xl font-bold text-gray-900">{prescriptions.filter(p => p.status === "uploaded").length}</p>
          <p className="text-sm text-gray-500">Pending Review</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-2xl font-bold text-gray-900">{prescriptions.filter(p => p.status === "ready").length}</p>
          <p className="text-sm text-gray-500">Ready for Pickup</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
          <p className="text-sm text-gray-500">Medicines in Stock</p>
        </div>
      </div>
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
        {[
          { key: "prescriptions", label: "Prescriptions", icon: <FiFileText className="w-4 h-4" /> },
          { key: "inventory", label: "Inventory", icon: <FiPackage className="w-4 h-4" /> }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === tab.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
      {activeTab === "prescriptions" && (
        <div className="space-y-3">
          {prescriptions.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <FiFileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No prescriptions received yet</p>
            </div>
          ) : (
            prescriptions.map((p) => {
              const config = statusConfig[p.status] || statusConfig.uploaded;
              return (
                <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                        <FiUser className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{p.patientName || "Patient"}</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1">
                          {p.patientPhone && <><FiPhone className="w-3 h-3" /> {p.patientPhone}</>}
                          {p.doctorName && <> • Dr. {p.doctorName}</>}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
                      {config.label}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {(p.medicines || []).map((med, i) => (
                      <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium">
                        {med}
                      </span>
                    ))}
                  </div>

                  {p.notes && <p className="text-xs text-gray-400 mb-3">Notes: {p.notes}</p>}

                  {p.status === "uploaded" && (
                    <div className="flex gap-2">
                      <button onClick={() => handlePrescription(p.id, "validated")}
                        className="px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-medium hover:bg-green-700 transition">
                        Validate
                      </button>
                      <button onClick={() => handlePrescription(p.id, "ready")}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-medium hover:bg-blue-700 transition">
                        Mark Ready
                      </button>
                      <button onClick={() => handlePrescription(p.id, "rejected")}
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-xs font-medium hover:bg-gray-200 transition">
                        Reject
                      </button>
                    </div>
                  )}
                  {p.status === "validated" && (
                    <button onClick={() => handlePrescription(p.id, "ready")}
                      className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-medium hover:bg-blue-700 transition">
                      Mark Ready for Pickup
                    </button>
                  )}
                  {p.status === "ready" && (
                    <button onClick={() => handlePrescription(p.id, "delivered")}
                      className="px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-medium hover:bg-green-700 transition">
                      Mark Delivered
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
      {activeTab === "inventory" && (
        <div>
          
          <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
            <h3 className="font-semibold text-gray-900 mb-3">Add Medicine</h3>
            <div className="flex gap-3">
              <input
                type="text"
                value={newMedicine.name}
                onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                placeholder="Medicine name"
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="number"
                value={newMedicine.stock}
                onChange={(e) => setNewMedicine({ ...newMedicine, stock: e.target.value })}
                placeholder="Stock"
                className="w-24 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500"
              />
              <input
                type="number"
                value={newMedicine.price}
                onChange={(e) => setNewMedicine({ ...newMedicine, price: e.target.value })}
                placeholder="Price (₹)"
                className="w-28 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={addMedicine}
                className="px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition"
              >
                <FiPlus className="w-5 h-5" />
              </button>
            </div>
          </div>
          {inventory.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <FiPackage className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No medicines in inventory</p>
              <p className="text-gray-400 text-sm">Add medicines using the form above</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="grid grid-cols-4 gap-4 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                <span>Medicine</span>
                <span>Stock</span>
                <span>Price</span>
                <span>Action</span>
              </div>
              {inventory.map((med) => (
                <div key={med.id} className="grid grid-cols-4 gap-4 px-5 py-3 border-t border-gray-100 items-center">
                  <span className="text-sm font-medium text-gray-900">{med.name}</span>
                  <span className={`text-sm ${med.stock < 10 ? "text-red-600 font-semibold" : "text-gray-600"}`}>
                    {med.stock} units {med.stock < 10 && "⚠️"}
                  </span>
                  <span className="text-sm text-gray-600">₹{med.price || 0}</span>
                  <button
                    onClick={() => removeMedicine(med.id)}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PharmacyDashboard;
