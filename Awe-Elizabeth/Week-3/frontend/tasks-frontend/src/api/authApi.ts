import {tokenStore } from "../utils/accessToken";
import axiosClient,{axiosAuthClient} from "./axiosClient";

export const registerUser = async (registerData: any) => {
  const { data } = await axiosClient.post("/auth/register", { firstName: registerData.cleanFirstName, lastName: registerData.cleanLastName, email: registerData.cleanEmail, password: registerData.cleanPassword });
  return data;
};

export const loginUser = async (email: string, password: string) => {
  const { data } = await axiosClient.post("/auth/login", { email, password });
  tokenStore.setToken(data.result.accessToken)
  return data;
};

export const logoutUser = async () => {
  const { data } = await axiosClient.post("/auth/logout");
  return data;
};

export const refreshToken = async () => {
  try {
    const { data } = await axiosClient.post("/auth/refresh");
    console.log(data)
    tokenStore.setToken(data.result.accessToken)
    return data.result.accessToken;
  } catch {
    return null;
  }
};
