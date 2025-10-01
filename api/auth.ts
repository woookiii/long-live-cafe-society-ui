import api from "@/lib/axios";

export const registerUser = async({
  name,
  email,
  password
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
  try {
    const res = await api.post('/create', { email, name, password });
    return res.data;
  } catch (err: any) {
    const message = err.response?.data?.message || 'Failed to register'
    throw new Error(message);
  }
}

export const loginUser = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const res = await api.post('/doLogin', credentials);
    return res.data;
  } catch (err: any) {
    const message = err.response?.data?.message || 'Failed to login'
    throw new Error(message);
  }
}

export const logoutUser = async () => {
  try {
    await api.post('/doLogout');
  } catch (err: any) {
    const message = err.response?.data?.message || 'Failed to logout'
    throw new Error(message);
  }
}

export const refreshAccessToken = async () => {
  try {
    const res = await api.post('/refresh-token');
    return res.data;
  } catch (err: any) {
    const message = err.response?.data?.message || 'Failed to refresh access token'
    throw new Error(message);
  }
}