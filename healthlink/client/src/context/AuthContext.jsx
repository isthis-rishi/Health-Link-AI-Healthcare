import { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";
import { createUserProfile, getUserProfile } from "../services/database";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const signup = async (email, password, name, role, extraData = {}) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });

    const profileData = {
      name,
      email,
      role,
      phone: extraData.phone || "",
      ...extraData
    };

    await createUserProfile(result.user.uid, profileData);
    const profile = await getUserProfile(result.user.uid);
    setUserProfile(profile);
    return result.user;
  };

  const login = async (email, password) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const profile = await getUserProfile(result.user.uid);
    setUserProfile(profile);
    return result.user;
  };

  const loginWithGoogle = async (role, extraData = {}) => {
    const result = await signInWithPopup(auth, googleProvider);
    let profile = await getUserProfile(result.user.uid);

    if (!profile) {
      const profileData = {
        name: result.user.displayName || "User",
        email: result.user.email,
        role,
        phone: "",
        ...extraData
      };
      await createUserProfile(result.user.uid, profileData);
      profile = await getUserProfile(result.user.uid);
    }

    setUserProfile(profile);
    return result.user;
  };

  const logout = async () => {
    await signOut(auth);
    setUserProfile(null);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(profile);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    isPatient: userProfile?.role === "patient",
    isClinic: userProfile?.role === "clinic",
    isPharmacy: userProfile?.role === "pharmacy"
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
