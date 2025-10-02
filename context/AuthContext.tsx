'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { refreshAccessToken } from "@/api/auth";
import { setStoredAccessToken } from "@/lib/authToken";

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (accessToken: string | null) => void;
  username: string | null;
  setUsername: (username: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);


  useEffect(() => {
    const loadAuth = async () => {
      try {
        const { token: newToken } = await refreshAccessToken();
        setUsername(localStorage.getItem('username') || '');
        setAccessToken(newToken);
        setStoredAccessToken(newToken);
      } catch (err: any) {
        console.log("Failed to refresh token");
      }
    }
    loadAuth();
  }, []);

  useEffect(() => {
    setStoredAccessToken(accessToken);
  }, [accessToken]);
  
  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken, username, setUsername }}>
      {children}
    </AuthContext.Provider>
  )
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within a provider');
  return context;
}
 
export default AuthProvider;