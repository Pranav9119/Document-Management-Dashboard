import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

/* ── Upload ── */
export const uploadFile = (formData, onUploadProgress) =>
  API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
  });

export const notifyBulkComplete = (count) =>
  API.post('/upload/bulk-notify', { count });

/* ── Documents ── */
export const getDocuments = () => API.get('/documents');

export const downloadDocument = (id) =>
  API.get(`/documents/${id}/download`, { responseType: 'blob' });

/* ── Notifications ── */
export const getNotifications = () => API.get('/notifications');

export const markRead = (id) => API.patch(`/notifications/${id}/read`);

export const markAllRead = () => API.patch('/notifications/read-all');
