// import axios from "axios";
// import { getAccessToken } from "../contexts/AuthContext";
// import { post } from "../components/PostCard";
// import { IResponse, LoginResponse } from "../utils/interfaces/response";
// import { IUser, RegisterRequest } from "../utils/interfaces/userInterface";

// // Adjust this to your backend API base URL
// const API_URL = "/api/v1";

// const api = axios.create({
//   baseURL: API_URL,
//   withCredentials: true, 
//  validateStatus: () => true,
// },
// );

// // Automatically attach access token
// api.interceptors.request.use((config) => {
//   const token = getAccessToken();
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });


// // refresh
// export const refreshAccessToken = async () => {
//   const res = await axios.post(`api/v1/auth/refresh`, { withCredentials: true });
//   return res.data?.result; 
// };

// // Login endpoint
// export const loginRequest = async (email: string, password: string) => {
//   const res = await api.post<IResponse<LoginResponse>>(`/auth/login`, { email, password });
//   return res.data; 
// };

// // Logout endpoint
// export const logoutRequest = async () => {
//   const res = await api.get<IResponse<string>>(`/auth/logout`);
//   console.log(res)
// };

// export const registerRequest = async (payload: RegisterRequest) => {
//   const res = await api.post(`/auth/register`, payload);
//   return res.data; // expected: { accessToken, user }
// };

// // ========== APP ENDPOINTS ==========

// export const getAllPosts = async (): Promise<post[] | []> => {
//   const res = await api.get("/posts");
//   return res.data?.result;
// };

// export const createPost = async (payload: { title: string; description: string, skills: string[] }) => {
//   const res = await api.post("/posts", payload);
//   console.log(res)
//   return res.data;
// };


// export const getUserPosts = async () => {
//   const res = await api.get<IResponse<post[]>>("/posts/user");
//   console.log(res)
//   return res.data.result;
// };


// // User Endpoints
// export const getUser = async () => {
//   const res = await api.get<IResponse<IUser>>("/users/active" );
//   return res.data;
// };


import axios from 'axios'
import { getAccessToken, setAccessToken } from '../utils/authHelpers'


const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5090/api/v1'


const api = axios.create({
baseURL: API_BASE,
withCredentials: true, // so refresh cookie is sent
})


let isRefreshing = false
let failedQueue: Array<{resolve: (t: any) => void, reject: (e: any) => void}> = []


const processQueue = (error: any, token: string | null = null) => {
failedQueue.forEach(p => {
if (error) p.reject(error)
else p.resolve(token)
})
failedQueue = []
}


api.interceptors.request.use((config) => {
const token = getAccessToken()
if (token && config.headers) config.headers.Authorization = `Bearer ${token}`
return config
})


api.interceptors.response.use(
(res) => res,
(err) => {
const originalRequest = err.config
if (err.response && err.response.status === 401 && !originalRequest._retry) {
if (isRefreshing) {
return new Promise(function(resolve, reject) {
failedQueue.push({ resolve, reject })
}).then((token) => {
originalRequest.headers['Authorization'] = 'Bearer ' + token
return api(originalRequest)
})
}


originalRequest._retry = true
isRefreshing = true


return new Promise(async (resolve, reject) => {
try {
// call refresh endpoint on the API (server should set new refresh cookie if needed)
const r = await axios.post(API_BASE + '/auth/refresh', {}, { withCredentials: true })
const newToken = r.data.accessToken
setAccessToken(newToken)
api.defaults.headers.common['Authorization'] = 'Bearer ' + newToken
processQueue(null, newToken)
resolve(api(originalRequest))
} catch (e) {
processQueue(e, null)
reject(e)
} finally {
isRefreshing = false
}
})
}
return Promise.reject(err)
}
)


export default api