// src/services/api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Phone se localhost nahi chalega, laptop ka IP use karo
// Apna IP yahan dalo (ipconfig se check karo)
const LAPTOP_IP = '10.12.34.23';

const BASE_URL = Platform.OS === 'web'
  ? 'http://localhost:5000'
  : `http://${LAPTOP_IP}:5000`;

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log('Token retrieval error:', error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// ─── AUTH ────────────────────────────────────────────────────────────────────
export const register = async ({ name, email, password, role }) => {
  const response = await apiClient.post('/api/auth/register', {
    name,
    email,
    password,
    role,
  });
  return response.data;
};

export const login = async ({ email, password }) => {
  const response = await apiClient.post('/api/auth/login', { email, password });
  return response.data;
};

// ─── MOVIES ──────────────────────────────────────────────────────────────────
export const getMovies = async () => {
  const response = await apiClient.get('/api/movies');
  return response.data;
};

export const addMovie = async ({ title, description, poster_url, genre }) => {
  const response = await apiClient.post('/api/movies', {
    title,
    description,
    poster_url,
    genre,
  });
  return response.data;
};

// ─── PAYMENT ─────────────────────────────────────────────────────────────────
export const processPayment = async ({ upiId, amount }) => {
  const response = await apiClient.post('/api/payment/process', { upiId, amount });
  return response.data;
};

// ─── BOOKINGS ────────────────────────────────────────────────────────────────
export const createBooking = async ({
  userId,
  showtimeId,
  seats,
  totalPrice,
  userEmail,
  transactionId,
}) => {
  const response = await apiClient.post('/api/bookings/book', {
    userId,
    showtimeId,
    seats,
    totalPrice,
    userEmail,
    transactionId,
  });
  return response.data;
};

export const getUserBookings = async (userId) => {
  const response = await apiClient.get(`/api/bookings/user/${userId}`);
  return response.data;
};

export default apiClient;
