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

/** Enregistre des donnees dans un fichier JSON sur l'appareil de l'utilisateur. */
export function saveJson(donnees, nomFichier) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(donnees, null, 2)], { type: 'application/json' }))
  const link = document.createElement('a')
  link.href = url
  link.download = nomFichier
  document.body.appendChild(link)
  link.click()
  link.remove()
  // Laisse au navigateur le temps de lancer le telechargement
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
