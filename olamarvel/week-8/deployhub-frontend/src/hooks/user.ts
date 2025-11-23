import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/user";

export const useRequireAuth = () => {
  const { user, isLoading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/register");
    }
  }, [user, isLoading, navigate]);

  return { user, isLoading };
};
