"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, signInWithPopup, signOut as firebaseSignOut } from '../lib/firebase';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  profilePhoto?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Centralized Microservice API Gateway URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5002';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check custom HttpOnly session on initial load
  useEffect(() => {
    let isMounted = true;
    const verifySession = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/verify`, { withCredentials: true });
        if (isMounted && response.data?.user) {
          setUser(response.data.user);
        }
      } catch (error) {
        // Silently handle 401/Unauthorized for periodic checks
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    verifySession();
    return () => { isMounted = false; };
  }, []);

  const loginWithGoogle = async () => {
    try {
      // 1. Trigger REAL Firebase Client Popup
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      
      console.log('Synchronizing real Google profile to TravelWise Database...');
      
      // 2. Send REAL Google data to backend -> Receives secure httpOnly Cookie
      const response = await axios.post(`${API_URL}/api/auth/login`, { 
        idToken: idToken,
        mockName: result.user.displayName,
        mockEmail: result.user.email,
        mockPhoto: result.user.photoURL
      }, { withCredentials: true });

      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error: any) {
      console.error('Google Sign-In Error:', error);
      const serverDetails = error.response?.data?.error || error.message;
      alert(`Authentication Gateway failed. Server Trace: ${serverDetails}`);
    }
  };

  const logout = async () => {
    try {
      // 1. Destroy Firebase Local Session
      // await firebaseSignOut(auth);
      
      // 2. Destroy Backend Microservice HttpOnly Cookie
      await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true });
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
