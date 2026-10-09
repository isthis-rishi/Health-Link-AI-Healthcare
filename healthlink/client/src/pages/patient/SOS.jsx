import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { createEmergency, getAllClinics } from "../../services/database";
import { FiAlertTriangle, FiMapPin, FiPhone, FiCheckCircle, FiClock } from "react-icons/fi";
import toast from "react-hot-toast";

const SOS = () => {
  const { currentUser, userProfile } = useAuth();
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [loading, setLoading] = useState(false);
  const [triggered, setTriggered] = useState(false);
  const [emergencyData, setEmergencyData] = useState(null);
  const [nearestClinic, setNearestClinic] = useState(null);
  const [symptoms, setSymptoms] = useState("");
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => {
          setLocationError("Location access denied. Please enable location services.");
        },
        { enableHighAccuracy: true }
      );
    } else {
      setLocationError("Geolocation not supported by your browser.");
    }
  }, []);

  const findNearestClinic = (clinics, userLat, userLng) => {
    if (!clinics.length) return null;

    let nearest = clinics[0];
    let minDist = Infinity;

    clinics.forEach(clinic => {
      const dist = Math.sqrt(
        Math.pow((clinic.latitude || 0) - userLat, 2) +
        Math.pow((clinic.longitude || 0) - userLng, 2)
      );
      if (dist < minDist) {
        minDist = dist;
        nearest = clinic;
      }
    });

    return nearest;
  };

  const startCountdown = () => {
    setCountdown(5);
  };

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      triggerSOS();
      setCountdown(null);
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const cancelCountdown = () => {
    setCountdown(null);
    toast("SOS cancelled", { icon: "✋" });
  };

  const triggerSOS = async () => {
    setLoading(true);
    try {
      const clinics = await getAllClinics();
      let clinic = null;

      if (location && clinics.length > 0) {
        clinic = findNearestClinic(clinics, location.lat, location.lng);
      } else if (clinics.length > 0) {
        clinic = clinics[0];
      }

      setNearestClinic(clinic);

      const emergencyInfo = {
        patientId: currentUser.uid,
        patientName: userProfile?.name || "Unknown",
        patientPhone: userProfile?.phone || "",
        emergencyContact: userProfile?.emergencyContact || "",
        bloodGroup: userProfile?.bloodGroup || "",
        symptoms: symptoms || "Emergency - no details provided",
        location: location || { lat: 0, lng: 0 },
        nearestClinicId: clinic?.id || "",
        nearestClinicName: clinic?.clinicName || clinic?.name || "Nearest available",
        triageLevel: "EMERGENCY",
        status: "triggered"
      };

      const emergencyId = await createEmergency(emergencyInfo);
      setEmergencyData({ id: emergencyId, ...emergencyInfo });
      setTriggered(true);
      toast.success("Emergency SOS triggered! Help is on the way.");
    } catch (error) {
      console.error("SOS error:", error);
      toast.error("Failed to trigger SOS. Please call emergency services directly.");
    }
    setLoading(false);
  };

  if (triggered) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          
          <div className="bg-green-500 p-6 text-white text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiCheckCircle className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold">Emergency Alert Sent</h1>
            <p className="text-green-100 text-sm mt-1">Help is being coordinated</p>
          </div>

          <div className="p-6 space-y-4">
            
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-xs text-blue-600 font-medium mb-1">NEAREST CLINIC NOTIFIED</p>
              <p className="font-bold text-gray-900">{nearestClinic?.clinicName || nearestClinic?.name || "Nearest Clinic"}</p>
              <p className="text-sm text-gray-500">{nearestClinic?.clinicAddress || nearestClinic?.address || "Address not available"}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 font-medium mb-2">INFORMATION SHARED WITH CLINIC</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-400">Name</p>
                  <p className="font-medium text-gray-900">{userProfile?.name}</p>
                </div>
                <div>
                  <p className="text-gray-400">Blood Group</p>
                  <p className="font-medium text-gray-900">{userProfile?.bloodGroup || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-400">Phone</p>
                  <p className="font-medium text-gray-900">{userProfile?.phone || "N/A"}</p>
                </div>
                <div>
                  <p className="text-gray-400">Location</p>
                  <p className="font-medium text-gray-900">
                    {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "Not available"}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <p className="text-xs text-red-600 font-medium mb-2">EMERGENCY NUMBERS</p>
              <div className="space-y-2">
                {[
                  { name: "Ambulance", number: "108" },
                  { name: "Emergency", number: "112" },
                  { name: "Police", number: "100" },
                ].map((num, i) => (
                  <a key={i} href={`tel:${num.number}`} className="flex items-center justify-between p-2 bg-white rounded-lg hover:bg-red-100 transition">
                    <span className="text-sm font-medium text-gray-700">{num.name}</span>
                    <span className="flex items-center gap-1 text-red-600 font-bold text-sm">
                      <FiPhone className="w-4 h-4" /> {num.number}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <button
              onClick={() => { setTriggered(false); setEmergencyData(null); }}
              className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition"
            >
              Back to SOS
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Emergency SOS</h1>
        <p className="text-gray-500 text-sm mt-1">Press the button below to alert the nearest clinic</p>
      </div>
      <div className={`mb-6 p-3 rounded-xl flex items-center gap-3 text-sm ${
        location ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
      }`}>
        <FiMapPin className="w-5 h-5 flex-shrink-0" />
        {location ? (
          <span>Location detected: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}</span>
        ) : locationError ? (
          <span>{locationError}</span>
        ) : (
          <span>Detecting your location...</span>
        )}
      </div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Briefly describe the emergency (optional)
        </label>
        <textarea
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="e.g., Severe chest pain, difficulty breathing..."
          rows={3}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-red-400 resize-none"
        />
      </div>
      <div className="flex justify-center mb-6">
        {countdown !== null ? (
          <div className="text-center">
            <button
              onClick={cancelCountdown}
              className="w-40 h-40 rounded-full bg-yellow-500 text-white flex flex-col items-center justify-center shadow-2xl hover:bg-yellow-600 transition relative"
            >
              <span className="text-4xl font-bold">{countdown}</span>
              <span className="text-sm mt-1">Tap to Cancel</span>
            </button>
            <p className="text-sm text-gray-500 mt-4">Sending SOS in {countdown} seconds...</p>
          </div>
        ) : (
          <div className="text-center">
            <button
              onClick={startCountdown}
              disabled={loading}
              className="w-40 h-40 rounded-full bg-red-600 text-white flex flex-col items-center justify-center shadow-2xl hover:bg-red-700 transition relative sos-pulse disabled:opacity-50"
            >
              <FiAlertTriangle className="w-10 h-10 mb-1" />
              <span className="text-lg font-bold">SOS</span>
            </button>
            <p className="text-sm text-gray-500 mt-4">Press and hold to trigger emergency alert</p>
          </div>
        )}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <p className="font-semibold text-gray-900 text-sm mb-3">What happens when you press SOS:</p>
        <div className="space-y-3">
          {[
            { step: "1", text: "Your location is shared with the nearest clinic" },
            { step: "2", text: "System assesses urgency" },
            { step: "3", text: "Nearest clinic and medical store are notified" },
            { step: "4", text: "You receive confirmation with help ETA" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-7 h-7 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                {item.step}
              </div>
              <p className="text-sm text-gray-600">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SOS;
