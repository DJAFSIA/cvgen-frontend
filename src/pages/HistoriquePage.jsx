import { useState, useEffect } from 'react'
import { candidatureAPI } from '../services/api'

export default function HistoriquePage() {
  const [candidatures, setCandidatures] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    candidatureAPI.list()
      .then(res => setCandidatures(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const statusColor = {
    'en_cours': 'bg-primary/20 text-primary-light border-primary/30',
    'generee': 'bg-green-500/20 text-green-400 border-green-500/30',
    'exportee': 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  }

  const statusLabel = {
    'en_cours': 'En cours',
    'generee': 'Généré',
    'exportee': 'Exporté',
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Historique</h1>
        <p className="text-gray-400 text-sm mt-1">{candidatures.length} candidature(s) au total</p>
      </div>

      {loading ? (
        <div className="text-center text-gray-500 py-12">Chargement...</div>
      ) : candidatures.length === 0 ? (
        <div className="text-center text-gray-500 py-12 bg-white/3 border border-white/8 rounded-xl">
          Aucune candidature pour l'instant
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {candidatures.map(c => (
            <div key={c.id} className="bg-white/3 border border-white/8 rounded-xl px-5 py-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white font-medium text-sm">Candidature #{c.id.slice(0, 8)}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    Créée le {new Date(c.date_creation).toLocaleDateString('fr-FR', {
                      day: '2-digit', month: 'long', year: 'numeric'
                    })}
                  </p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full border ${statusColor[c.statut] || statusColor['en_cours']}`}>
                  {statusLabel[c.statut] || 'En cours'}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-4">
                <div className="flex-1 bg-white/5 rounded-full h-1.5">
                  <div
                    className="bg-primary-light h-1.5 rounded-full"
                    style={{ width: `${c.score_compatibilite || 0}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 min-w-max">
                  Score : {c.score_compatibilite || 0}%
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
