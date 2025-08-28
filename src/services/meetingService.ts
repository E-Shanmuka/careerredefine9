import axios from 'axios';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3000';

export type PremiumMeeting = {
  _id: string;
  user: string | { _id: string; name?: string; email?: string };
  name: string;
  email: string;
  message?: string;
  status: 'pending' | 'approved' | 'rejected';
  meetingLink?: string;
  scheduledAt?: string;
  createdAt: string;
  updatedAt: string;
};

export const meetingService = {
  async create(data: { name: string; email: string; message?: string }) {
    const res = await axios.post(`${API_URL}/api/v1/premium-meetings`, data, { withCredentials: true });
    return res.data?.data?.meeting as PremiumMeeting;
  },
  async mine() {
    const res = await axios.get(`${API_URL}/api/v1/premium-meetings/mine`, { withCredentials: true });
    return (res.data?.data?.meetings || []) as PremiumMeeting[];
  },
  async adminList() {
    const res = await axios.get(`${API_URL}/api/v1/admin/premium-meetings`, { withCredentials: true });
    return (res.data?.data?.meetings || []) as PremiumMeeting[];
  },
  async adminUpdate(id: string, payload: { status: 'approved' | 'rejected' | 'pending'; meetingLink?: string; scheduledAt?: string }) {
    const res = await axios.patch(`${API_URL}/api/v1/admin/premium-meetings/${id}`, payload, { withCredentials: true });
    return res.data?.data?.meeting as PremiumMeeting;
  },
  async adminDelete(id: string) {
    await axios.delete(`${API_URL}/api/v1/admin/premium-meetings/${id}`, { withCredentials: true });
  }
};
