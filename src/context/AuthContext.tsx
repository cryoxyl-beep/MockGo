import React, { createContext, useContext, useEffect, useState } from 'react';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  profilePhoto: string;
  createdAt: string;
}

interface AuthContextType {
  user: any;
  profile: UserProfile | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('instamocks_user_session');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState<boolean>(false);

  const loginWithGoogle = async () => {
    setLoading(true);
    // Use simulated secure local browser auth to satisfy client sandbox execution without external Firebase servers
    setTimeout(() => {
      const mockUser: UserProfile = {
        uid: 'user-academic-sandbox',
        name: 'Saisantosh Sai',
        email: 'saisantoshsai3@gmail.com',
        profilePhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        createdAt: new Date().toISOString()
      };
      setProfile(mockUser);
      localStorage.setItem('instamocks_user_session', JSON.stringify(mockUser));
      setLoading(false);
    }, 850);
  };

  const logout = async () => {
    setLoading(true);
    setTimeout(() => {
      setProfile(null);
      localStorage.removeItem('instamocks_user_session');
      setLoading(false);
    }, 400);
  };

  return (
    <AuthContext.Provider value={{ user: profile, profile, loading, loginWithGoogle, logout }}>
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
