import { io, Socket } from 'socket.io-client';

const API_BASE_URL = 'http://localhost:5000/api/v1';
const SOCKET_URL = 'http://localhost:5000';

let socket: Socket | null = null;

export function getCustomerSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL);
  }
  return socket;
}

export const api = {
  // Auth
  async requestOtp(phoneNumber: string) {
    const res = await fetch(`${API_BASE_URL}/auth/otp/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber }),
    });
    return await res.json();
  },

  async verifyOtp(phoneNumber: string, otp: string, fullName?: string) {
    const res = await fetch(`${API_BASE_URL}/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneNumber, otp, fullName, role: 'CUSTOMER' }),
    });
    return await res.json();
  },

  // Stores
  async getStores(ward?: string, category?: string, search?: string) {
    const params = new URLSearchParams();
    if (ward && ward !== 'All') params.append('ward', ward);
    if (category && category !== 'ALL') params.append('category', category);
    if (search) params.append('search', search);

    const res = await fetch(`${API_BASE_URL}/stores?${params.toString()}`);
    return await res.json();
  },

  async getStoreById(id: string) {
    const res = await fetch(`${API_BASE_URL}/stores/${id}`);
    return await res.json();
  },

  // Orders
  async createOrder(orderData: any, token: string) {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });
    return await res.json();
  },

  async getOrderById(orderId: string) {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}`);
    return await res.json();
  },

  async getMyOrders(token: string) {
    const res = await fetch(`${API_BASE_URL}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return await res.json();
  },

  // Mobile Money
  async initiateMomoPush(orderId: string, phoneNumber: string, provider: string, token: string) {
    const res = await fetch(`${API_BASE_URL}/payments/momo/push`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ orderId, phoneNumber, provider }),
    });
    return await res.json();
  },

  async simulateMomoApproval(orderId: string) {
    const res = await fetch(`${API_BASE_URL}/payments/momo/simulate-approval/${orderId}`, {
      method: 'POST',
    });
    return await res.json();
  },
};
