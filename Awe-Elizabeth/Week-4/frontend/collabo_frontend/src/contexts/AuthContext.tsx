import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { refreshAccessToken, loginRequest, logoutRequest, getUser } from "../services/api";
import { IUser } from "../utils/interfaces/userInterface";
import { IResponse, LoginResponse } from "../utils/interfaces/response";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: IUser | null;
  accessToken: string | null;
  loginError: string | null;
  login: (email: string, password: string) => Promise<IResponse<LoginResponse>>;
  logout: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 🧠 In-memory token (not in localStorage for better security)
let inMemoryToken: string | null = null;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(inMemoryToken);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);


  //Refresh token on each reload
  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await refreshAccessToken();
        if (data?.accessToken) {
          inMemoryToken = data.accessToken;
          setAccessToken(data.accessToken);
          const user = await getUser();
          setUser(user.result);
        }
      } catch {
        console.log("No valid session found");
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) : Promise<IResponse<LoginResponse>> => {
    const data : IResponse<LoginResponse> = await loginRequest(email, password);
    if(data.success){
        inMemoryToken = data.result.accessToken;
        setAccessToken(data.result.accessToken);
        const user = await getUser();
        setUser(user.result);
    }
        return data
  };

  const logout = async () => {
    await logoutRequest();
    inMemoryToken = null;
    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, login, loginError, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for consuming context
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

// Helper for API to access the token
export const getAccessToken = () => inMemoryToken;
