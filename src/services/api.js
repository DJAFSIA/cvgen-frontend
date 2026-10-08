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
  if (status === 429) return t('common.tooMany')
  // 502 = service d'IA indisponible : le serveur fournit un message dedie
  if (typeof data?.detail === 'string' && (status < 500 || status === 502)) return data.detail
  return t(fallbackKey)
}

export const authAPI = {
  inscription: (data) => api.post('/auth/inscription', data),
  login: (data) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
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
  generer: (id, reponsesAlignement = [], modeleCv = 'classique') =>
    api.post(`/candidature/${id}/generer`, {
      modele_cv: modeleCv,
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
