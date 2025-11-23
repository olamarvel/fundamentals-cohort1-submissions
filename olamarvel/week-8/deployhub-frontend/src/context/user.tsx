import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
  useContext,
} from "react";

import { fetchCurrentUser, logoutUser as serviceLogoutUser } from "@/services/auth";
import type { User, UserContextProps } from "@/lib/type";

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const fetchedUser = await fetchCurrentUser(); 
      setUser(fetchedUser);
    } catch (err) {
      console.error("Error fetching user", err);
      setUser(null);
      setError("Failed to fetch user data");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await serviceLogoutUser();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{ user, isLoading, error, setUser, fetchUser, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within a UserProvider");
  return ctx;
};
