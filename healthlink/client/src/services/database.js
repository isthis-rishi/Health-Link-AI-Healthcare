import {
  doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc,
  collection, query, where, orderBy, limit, serverTimestamp,
  onSnapshot, addDoc, GeoPoint
} from "firebase/firestore";
import { db } from "./firebase";
export const createUserProfile = async (uid, data) => {
  const userRef = doc(db, "users", uid);
  await setDoc(userRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  return userRef;
};

export const getUserProfile = async (uid) => {
  const userRef = doc(db, "users", uid);
  const snapshot = await getDoc(userRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  }
  return null;
};

export const updateUserProfile = async (uid, data) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: serverTimestamp()
  });
};
export const registerClinic = async (data) => {
  const clinicRef = await addDoc(collection(db, "clinics"), {
    ...data,
    status: "active",
    createdAt: serverTimestamp()
  });
  return clinicRef.id;
};

export const getAllClinics = async () => {
  const snapshot = await getDocs(collection(db, "clinics"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getClinicById = async (clinicId) => {
  const clinicRef = doc(db, "clinics", clinicId);
  const snapshot = await getDoc(clinicRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  }
  return null;
};

export const updateClinic = async (clinicId, data) => {
  const clinicRef = doc(db, "clinics", clinicId);
  await updateDoc(clinicRef, { ...data, updatedAt: serverTimestamp() });
};
export const registerPharmacy = async (data) => {
  const pharmacyRef = await addDoc(collection(db, "pharmacies"), {
    ...data,
    status: "active",
    createdAt: serverTimestamp()
  });
  return pharmacyRef.id;
};

export const getAllPharmacies = async () => {
  const snapshot = await getDocs(collection(db, "pharmacies"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getPharmacyById = async (pharmacyId) => {
  const pharmacyRef = doc(db, "pharmacies", pharmacyId);
  const snapshot = await getDoc(pharmacyRef);
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  }
  return null;
};

export const updatePharmacyInventory = async (pharmacyId, inventory) => {
  const pharmacyRef = doc(db, "pharmacies", pharmacyId);
  await updateDoc(pharmacyRef, { inventory, updatedAt: serverTimestamp() });
};
export const createAppointment = async (data) => {
  const appointmentRef = await addDoc(collection(db, "appointments"), {
    ...data,
    status: "pending",
    createdAt: serverTimestamp()
  });
  return appointmentRef.id;
};

export const getAppointmentsByPatient = async (patientId) => {
  const q = query(
    collection(db, "appointments"),
    where("patientId", "==", patientId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAppointmentsByClinic = async (clinicId) => {
  const q = query(
    collection(db, "appointments"),
    where("clinicId", "==", clinicId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateAppointmentStatus = async (appointmentId, status, notes = "") => {
  const appointmentRef = doc(db, "appointments", appointmentId);
  await updateDoc(appointmentRef, { status, notes, updatedAt: serverTimestamp() });
};
export const createEmergency = async (data) => {
  const emergencyRef = await addDoc(collection(db, "emergencies"), {
    ...data,
    status: "triggered",
    createdAt: serverTimestamp()
  });
  return emergencyRef.id;
};

export const getActiveEmergencies = async () => {
  const q = query(
    collection(db, "emergencies"),
    where("status", "in", ["triggered", "responding"]),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getEmergenciesByClinic = async (clinicId) => {
  const q = query(
    collection(db, "emergencies"),
    where("nearestClinicId", "==", clinicId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateEmergencyStatus = async (emergencyId, status) => {
  const emergencyRef = doc(db, "emergencies", emergencyId);
  await updateDoc(emergencyRef, { status, updatedAt: serverTimestamp() });
};

export const listenToEmergencies = (clinicId, callback) => {
  const q = query(
    collection(db, "emergencies"),
    where("nearestClinicId", "==", clinicId),
    where("status", "in", ["triggered", "responding"])
  );
  return onSnapshot(q, (snapshot) => {
    const emergencies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(emergencies);
  });
};
export const createPrescription = async (data) => {
  const prescriptionRef = await addDoc(collection(db, "prescriptions"), {
    ...data,
    status: "uploaded",
    paymentStatus: "pending",
    createdAt: serverTimestamp()
  });
  return prescriptionRef.id;
};

export const getPrescriptionsByPatient = async (patientId) => {
  const q = query(
    collection(db, "prescriptions"),
    where("patientId", "==", patientId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getPrescriptionsByPharmacy = async (pharmacyId) => {
  const q = query(
    collection(db, "prescriptions"),
    where("pharmacyId", "==", pharmacyId),
    orderBy("createdAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updatePrescriptionStatus = async (prescriptionId, status, data = {}) => {
  const prescriptionRef = doc(db, "prescriptions", prescriptionId);
  await updateDoc(prescriptionRef, { status, ...data, updatedAt: serverTimestamp() });
};
export const createSymptomChat = async (patientId) => {
  const chatRef = await addDoc(collection(db, "symptomChats"), {
    patientId,
    messages: [],
    triageResult: null,
    status: "active",
    createdAt: serverTimestamp()
  });
  return chatRef.id;
};

export const updateSymptomChat = async (chatId, messages, triageResult = null) => {
  const chatRef = doc(db, "symptomChats", chatId);
  const updateData = { messages, updatedAt: serverTimestamp() };
  if (triageResult) {
    updateData.triageResult = triageResult;
    updateData.status = "completed";
  }
  await updateDoc(chatRef, updateData);
};

export const getSymptomChatsByPatient = async (patientId) => {
  const q = query(
    collection(db, "symptomChats"),
    where("patientId", "==", patientId),
    orderBy("createdAt", "desc"),
    limit(10)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
