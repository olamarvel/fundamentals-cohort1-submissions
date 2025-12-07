import { useState, useEffect } from "react";
import { api } from "../lib/api";
import { User } from "../types/index";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await api.getUsers();
      setUsers(data);
    } catch  {
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: { name: string; email: string }) => {
    try {
      await api.createUser(userData);
      await fetchUsers(); // Refresh list
      return true;
    } catch  {
      setError("Failed to create user");
      return false;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    createUser,
    refetch: fetchUsers,
  };
}
