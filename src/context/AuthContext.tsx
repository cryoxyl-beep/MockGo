import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { 
  loginWithGoogle as signWithGoogleService, 
  logoutUser as logoutService, 
  upsertUserProfile, 
  UserProfile 
} from '../services/auth';

interface AuthContextType {
  user: FirebaseUser | null;
  profile: UserProfile | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Setup the active auth state observer
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      if (currentUser) {
        setUser(currentUser);
        try {
          // Sync with Firestore
          const profileData = await upsertUserProfile(currentUser);
          setProfile(profileData);
        } catch (err) {
          console.error("Failed to sync profile to database, using local fallback state:", err);
          // Standard structural fallback for client session resilience
          setProfile({
            uid: currentUser.uid,
            name: currentUser.displayName || "Saisantosh Sai",
            email: currentUser.email || "saisantoshsai3@gmail.com",
            profilePhoto: currentUser.photoURL || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
            createdAt: new Date().toISOString()
          });
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const firebaseUser = await signWithGoogleService();
      setUser(firebaseUser);
      const profileData = await upsertUserProfile(firebaseUser);
      setProfile(profileData);
    } catch (err) {
      console.error("Google Auth execution failed:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutService();
      setUser(null);
      setProfile(null);
      // Clean drive states on standard log out
      localStorage.removeItem("drive_wristband");
      localStorage.removeItem("drive_email");
      localStorage.removeItem("drive_name");
    } catch (err) {
      console.error("Logout execution failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
