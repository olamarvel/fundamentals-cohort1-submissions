import axios from "axios";
import { getAccessToken } from "../contexts/AuthContext";
import { post } from "../components/PostCard";
import { IResponse, LoginResponse } from "../utils/interfaces/response";
import { IUser, RegisterRequest } from "../utils/interfaces/userInterface";

// Adjust this to your backend API base URL
const API_URL = "/api/v1";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, 
 validateStatus: () => true,
},
);

// Automatically attach access token
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


// refresh
export const refreshAccessToken = async () => {
  const res = await axios.post(`api/v1/auth/refresh`, { withCredentials: true });
  return res.data?.result; 
};

// Login endpoint
export const loginRequest = async (email: string, password: string) => {
  const res = await api.post<IResponse<LoginResponse>>(`/auth/login`, { email, password });
  return res.data; 
};

// Logout endpoint
export const logoutRequest = async () => {
  const res = await api.get<IResponse<string>>(`/auth/logout`);
  console.log(res)
};

export const registerRequest = async (payload: RegisterRequest) => {
  const res = await api.post(`/auth/register`, payload);
  return res.data; // expected: { accessToken, user }
};

// ========== APP ENDPOINTS ==========

export const getAllPosts = async (): Promise<post[] | []> => {
  const res = await api.get("/posts");
  return res.data?.result;
};

export const createPost = async (payload: { title: string; description: string, skills: string[] }) => {
  const res = await api.post("/posts", payload);
  console.log(res)
  return res.data;
};


export const getUserPosts = async () => {
  const res = await api.get<IResponse<post[]>>("/posts/user");
  console.log(res)
  return res.data.result;
};


// User Endpoints
export const getUser = async () => {
  const res = await api.get<IResponse<IUser>>("/users/active" );
  return res.data;
};