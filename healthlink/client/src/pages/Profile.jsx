import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateUserProfile } from "../services/database";
import { FiUser, FiPhone, FiMail, FiSave, FiShield } from "react-icons/fi";
import toast from "react-hot-toast";

const Profile = () => {
  const { currentUser, userProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: userProfile?.name || "",
    phone: userProfile?.phone || "",
    bloodGroup: userProfile?.bloodGroup || "",
    allergies: userProfile?.allergies || "",
    emergencyContact: userProfile?.emergencyContact || "",
    clinicName: userProfile?.clinicName || "",
    clinicAddress: userProfile?.clinicAddress || "",
    pharmacyName: userProfile?.pharmacyName || "",
    pharmacyAddress: userProfile?.pharmacyAddress || ""
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const updateData = { name: form.name, phone: form.phone };
      if (userProfile.role === "patient") {
        updateData.bloodGroup = form.bloodGroup;
        updateData.allergies = form.allergies;
        updateData.emergencyContact = form.emergencyContact;
      } else if (userProfile.role === "clinic") {
        updateData.clinicName = form.clinicName;
        updateData.clinicAddress = form.clinicAddress;
      } else if (userProfile.role === "pharmacy") {
        updateData.pharmacyName = form.pharmacyName;
        updateData.pharmacyAddress = form.pharmacyAddress;
      }
      await updateUserProfile(currentUser.uid, updateData);
      toast.success("Profile updated!");
      setEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    }
    setSaving(false);
  };

  const roleLabels = { patient: "Patient", clinic: "Healthcare Provider", pharmacy: "Pharmacy" };
  const roleColors = { patient: "bg-blue-100 text-blue-700", clinic: "bg-green-100 text-green-700", pharmacy: "bg-purple-100 text-purple-700" };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        
        <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <FiUser className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{userProfile?.name || "User"}</h2>
              <p className="text-primary-100 text-sm flex items-center gap-1">
                <FiMail className="w-3.5 h-3.5" /> {userProfile?.email}
              </p>
              <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${roleColors[userProfile?.role] || ""}`}>
                {roleLabels[userProfile?.role] || "User"}
              </span>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Full Name</label>
              {editing ? (
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500" />
              ) : (
                <p className="text-sm font-medium text-gray-900">{userProfile?.name || "Not set"}</p>
              )}
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Phone</label>
              {editing ? (
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500" />
              ) : (
                <p className="text-sm font-medium text-gray-900">{userProfile?.phone || "Not set"}</p>
              )}
            </div>
          </div>
          {userProfile?.role === "patient" && (
            <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-100">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Blood Group</label>
                {editing ? (
                  <select value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500">
                    <option value="">Select</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                  </select>
                ) : (
                  <p className="text-sm font-medium text-gray-900">{userProfile?.bloodGroup || "Not set"}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Allergies</label>
                {editing ? (
                  <input type="text" value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500" />
                ) : (
                  <p className="text-sm font-medium text-gray-900">{userProfile?.allergies || "None"}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Emergency Contact</label>
                {editing ? (
                  <input type="tel" value={form.emergencyContact} onChange={(e) => setForm({ ...form, emergencyContact: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500" />
                ) : (
                  <p className="text-sm font-medium text-gray-900">{userProfile?.emergencyContact || "Not set"}</p>
                )}
              </div>
            </div>
          )}
          {userProfile?.role === "clinic" && (
            <div className="space-y-4 pt-3 border-t border-gray-100">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Clinic Name</label>
                {editing ? (
                  <input type="text" value={form.clinicName} onChange={(e) => setForm({ ...form, clinicName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500" />
                ) : (
                  <p className="text-sm font-medium text-gray-900">{userProfile?.clinicName || "Not set"}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Address</label>
                {editing ? (
                  <input type="text" value={form.clinicAddress} onChange={(e) => setForm({ ...form, clinicAddress: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500" />
                ) : (
                  <p className="text-sm font-medium text-gray-900">{userProfile?.clinicAddress || "Not set"}</p>
                )}
              </div>
            </div>
          )}
          {userProfile?.role === "pharmacy" && (
            <div className="space-y-4 pt-3 border-t border-gray-100">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Pharmacy Name</label>
                {editing ? (
                  <input type="text" value={form.pharmacyName} onChange={(e) => setForm({ ...form, pharmacyName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500" />
                ) : (
                  <p className="text-sm font-medium text-gray-900">{userProfile?.pharmacyName || "Not set"}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Address</label>
                {editing ? (
                  <input type="text" value={form.pharmacyAddress} onChange={(e) => setForm({ ...form, pharmacyAddress: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500" />
                ) : (
                  <p className="text-sm font-medium text-gray-900">{userProfile?.pharmacyAddress || "Not set"}</p>
                )}
              </div>
            </div>
          )}
          <div className="pt-4 border-t border-gray-100 flex gap-3">
            {editing ? (
              <>
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition disabled:opacity-50">
                  <FiSave className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
                </button>
                <button onClick={() => setEditing(false)}
                  className="px-5 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition">
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setEditing(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition">
                Edit Profile
              </button>
            )}
          </div>
        </div>
        <div className="bg-gray-50 p-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FiShield className="w-4 h-4 text-green-500" />
            Your data is encrypted and shared only with your consent.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
