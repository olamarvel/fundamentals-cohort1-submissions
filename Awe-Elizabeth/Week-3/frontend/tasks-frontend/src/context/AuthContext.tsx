import React, { createContext, useState, useEffect } from "react";
import { loginUser, logoutUser, refreshToken } from "../api/authApi";
import { tokenStore } from "../utils/accessToken";

interface AuthContextType {
  user: any;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(tokenStore.getToken());

  const login = async (email: string, password: string) => {
    const data = await loginUser(email, password);
    setAccessToken(data.result.accessToken)
    setUser(data.user);
  };

  const logout = async () => {
    await logoutUser()
    setUser(null);
  };

  // on reload
  useEffect(() => {
  const silentRefresh = async () => {
    try {
      const res = await refreshToken();
        setAccessToken(res)
    } catch (error) {
      console.error(error)
      console.log("User not logged in or refresh token invalid.");
      setUser(null);
      setAccessToken(null);
    }
  };

  silentRefresh();
}, []);


  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
