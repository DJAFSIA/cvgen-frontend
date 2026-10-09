import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

const AUTH_ENDPOINTS = ['/auth/login', '/auth/inscription']

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || ''
    // Un 401 sur login/inscription est une erreur de saisie, pas une session expiree
    if (error.response?.status === 401 && !AUTH_ENDPOINTS.some((p) => url.includes(p))) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

/**
 * Message affichable pour une erreur axios : detail du serveur si c'est un texte,
 * sinon message generique traduit (t = fonction de traduction).
 */
export function errorMessage(error, t, fallbackKey = 'common.error') {
  if (!error.response) return t('common.network')
  const { status, data } = error.response
  const detail = data?.detail
  // Le serveur renvoie {code, message} : on traduit le code, le message sert de secours
  if (detail && typeof detail === 'object' && detail.code) {
    const key = `errors.${detail.code}`
    const translated = t(key)
    if (translated !== key) return translated
    if (typeof detail.message === 'string' && status < 500) return detail.message
  }
  if (status === 429) return t('common.tooMany')
  if (typeof detail === 'string' && status < 500) return detail
  return t(fallbackKey)
}

export const authAPI = {
  inscription: (data) => api.post('/auth/inscription', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  verifyEmail: (data) => api.post('/auth/verify-email', data),
  resendVerification: () => api.post('/auth/resend-verification'),
  forgot: (data) => api.post('/auth/forgot-password', data),
  reset: (data) => api.post('/auth/reset-password', data),
  google: (data) => api.post('/auth/google', data),
}

export const profilAPI = {
  get: () => api.get('/profil/'),
  update: (data) => api.put('/profil/', data),
  importCV: (formData) => api.post('/profil/import-cv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
}

export const offreAPI = {
  soumettre: (data) => api.post('/offre/', data),
  list: () => api.get('/offre/'),
  get: (id) => api.get(`/offre/${id}`),
  extraire: (url) => api.post('/offre/extraire', { url }),
  questionsAlignement: (id) => api.post(`/offre/${id}/questions-alignement`),
}

export const candidatureAPI = {
  create: (offreId) => api.post('/candidature/', { offre_id: offreId }),
  generer: (id, reponsesAlignement = [], modeleCv = 'classique', langueDocuments = 'auto') =>
    api.post(`/candidature/${id}/generer`, {
      modele_cv: modeleCv,
      langue_documents: langueDocuments,
      ton_lettre: 'professionnel',
      reponses_alignement: reponsesAlignement,
    }),
  list: () => api.get('/candidature/'),
  exportPdf: (id, type, modele) =>
    api.get(`/candidature/${id}/export-pdf`, {
      params: { type_doc: type, ...(modele ? { modele } : {}) },
      responseType: 'blob',
    }),
}

export default api
