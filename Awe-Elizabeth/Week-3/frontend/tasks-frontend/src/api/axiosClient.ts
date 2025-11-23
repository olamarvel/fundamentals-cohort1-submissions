import axios from "axios";
import { tokenStore} from "../utils/accessToken";

const axiosClient = axios.create({
  baseURL: "http://localhost:5010/api/v1",
  withCredentials: true,
});

axiosClient.interceptors.request.use((config) => {
  const token = tokenStore.getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const axiosAuthClient = axios.create({
  baseURL: "http://localhost:5010/api/v1",
  //withCredentials: true,
});

export default axiosClient;
