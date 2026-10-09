import { candidatureAPI } from './api'

/**
 * Telecharge un PDF via un lien signe de courte duree : le navigateur suit le lien
 * directement (pas de requete XHR), ce qui fonctionne aussi quand un gestionnaire de
 * telechargement (IDM, etc.) intercepte les PDF.
 */
export async function downloadDocument(candidatureId, type, modele) {
  const res = await candidatureAPI.lienTelechargement(candidatureId, type, modele)
  const link = document.createElement('a')
  link.href = `${candidatureAPI.baseURL}${res.data.url}`
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  link.remove()
}
