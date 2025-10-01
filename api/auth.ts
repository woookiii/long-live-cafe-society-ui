import api from "@/lib/axios";

export const refreshAccessToken = async () => {
  try {
    const res = await api.post('/refresh-token');
    return res.data;
  } catch (err: any) {
    const message = err.response?.data?.message || 'Failed to refresh access token'
    throw new Error(message);
  }
}