import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// File operations
export const getFiles = () => api.get('/api/files');
export const getFile = (filename: string) => api.get(`/api/file/${filename}`);
export const saveFile = (filename: string, content: string) => 
  api.post(`/api/file/${filename}`, { content });

// Draft operations
export const getDrafts = () => api.get('/api/drafts');
export const saveDraft = (id: string, content: string) => {
  const formData = new FormData();
  formData.append('id', id);
  formData.append('content', content);
  return api.post('/api/drafts', formData);
};
export const loadDraft = (id: string) => api.get(`/api/drafts/${id}`);

// Grammar checking
export const checkGrammar = (text: string) => {
  const formData = new FormData();
  formData.append('text', text);
  return api.post('/api/grammar-check', formData);
};

// History operations
export const getHistory = () => api.get('/api/history');
export const logHistory = (filename: string, content: string) => 
  api.post('/api/history/log', { filename, content });

// Cloud operations
export const authenticateCloud = () => api.post('/api/cloud/auth');
export const toggleCloudSync = (enabled: boolean) => 
  api.post(`/api/cloud/sync/${enabled}`);

// AI Assistant
export const getAIAssistance = (prompt: string) => 
  api.post('/api/ai/assist', { prompt });

// File upload and download
export const uploadFile = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/api/upload', formData);
};

export const downloadFile = (filename: string) => 
  api.get(`/api/download/${filename}`, { responseType: 'blob' });

export default api; 