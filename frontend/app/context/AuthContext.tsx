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
const API_URL = 'http://localhost:5002/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check custom HttpOnly session on initial load
  useEffect(() => {
    const verifySession = async () => {
      try {
        // Ping microservice to verify secure cookie
        const res = await axios.get(`${API_URL}/auth/verify`, { withCredentials: true });
        if (res.data.success) {
          // In a real app, /verify would return full user details, 
          // but for demo speed we spoof the loaded user if cookie is valid.
          setUser({ id: res.data.uid, name: 'Traveler', email: 'verified@auth.com' });
        }
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifySession();
  }, []);

  const loginWithGoogle = async () => {
    try {
      // 1. Trigger Firebase Client Popup
      // const result = await signInWithPopup(auth, googleProvider);
      // const idToken = await result.user.getIdToken();
      
      // Since we are running locally without real Firebase keys, we will spoof the ID token
      // structure and send it to our microservice for Postgres ingestion and JWT sealing.
      console.log('Using simulated Firebase Google Popup token...');
      const pseudoIdToken = `mock-firebase-${Date.now()}`;
      
      // 2. Send Firebase idToken to backend -> Receives secure httpOnly Cookie
      const response = await axios.post(`${API_URL}/auth/login`, { 
        idToken: pseudoIdToken,
        mockName: 'Demo User',
        mockEmail: 'demo@travelwise.in',
        mockPhoto: 'https://www.gravatar.com/avatar?d=mp'
      }, { withCredentials: true });

      if (response.data.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      alert('Authentication Gateway failed to process Google OAuth request.');
    }
  };

  const logout = async () => {
    try {
      // 1. Destroy Firebase Local Session
      // await firebaseSignOut(auth);
      
      // 2. Destroy Backend Microservice HttpOnly Cookie
      await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
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
