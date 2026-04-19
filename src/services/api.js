import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  inscription: (data) => api.post('/auth/inscription', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
}

export const profilAPI = {
  get: () => api.get('/profil/'),
  update: (data) => api.put('/profil/', data),
  //Import de CV avec multipart/form-data
  importCV: (formData) => api.post('/profil/import-cv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
}


export const offreAPI = {
  create: (data) => api.post('/offre/', data),
  list: () => api.get('/offre/'),
  get: (id) => api.get(`/offre/${id}`),
  extraire: (url) => api.post('/offre/extraire', { url }),
}

export const candidatureAPI = {
  create: (data) => api.post('/candidature/', data),
  list: () => api.get('/candidature/'),
  generer: (id, data) => api.post(`/candidature/${id}/generer`, data),
  exportPdf: (id, type) => api.get(`/candidature/${id}/export-pdf?type_doc=${type}`, { responseType: 'blob' }),
}

export default api
