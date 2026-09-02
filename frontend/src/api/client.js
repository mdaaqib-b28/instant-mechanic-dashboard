import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const api = axios.create({
  baseURL: BASE_URL,
})

export const getDashboard = () => api.get('/api/dashboard').then(r => r.data)

export const getBookings = (params) => api.get('/api/bookings', { params }).then(r => r.data)

export const getBooking = (id) => api.get(`/api/bookings/${id}`).then(r => r.data)

export const getMechanics = () => api.get('/api/mechanics').then(r => r.data)
