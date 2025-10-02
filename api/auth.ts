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
    await api.post('/member/create', { email, name, password });
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
    const res = await api.post('/member/doLogin', credentials);
    return res.data;
  } catch (err: any) {
    throw new Error(err.message);
  }
}

export const logoutUser = async () => {
  try {
    await api.post('/member/doLogout');
  } catch (err: any) {
    const message = err.response?.data?.message || 'Failed to logout'
    throw new Error(message);
  }
}

export const refreshAccessToken = async () => {
  try {
    const res = await api.post('/member/refresh-token');
    return res.data;
  } catch (err: any) {
    const message = err.response?.data?.message || 'Failed to refresh access token'
    throw new Error(message);
  }
}