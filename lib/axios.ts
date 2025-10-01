import axios from "axios";
import { getStoredAccessToken, setStoredAccessToken } from "./authToken";
import { refreshAccessToken } from "@/api/auth";

const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = getStoredAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config;
})

api.interceptors.response.use((res) => res,
  async (error) => {
    if (error.response?.status) {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.incluedes('/refresh-token')) {
        originalRequest._retry = true;        
        try {
          const { accessToken: newToken } = await refreshAccessToken();
          setStoredAccessToken(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return api(originalRequest);
        } catch (err) {
          console.error('Refresh token failed', err);
        }
      }
      return Promise.reject(error);
      
    }
  }
)

export default api;