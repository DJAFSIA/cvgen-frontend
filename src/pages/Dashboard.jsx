import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { candidatureAPI } from '../services/api'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [candidatures, setCandidatures] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    candidatureAPI.list()
      .then(res => setCandidatures(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const scoreMoyen = candidatures.length
    ? Math.round(candidatures.reduce((acc, c) => acc + (c.score_compatibilite || 0), 0) / candidatures.length)
    : 0

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
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          Bonjour, <span className="text-primary-light">{user?.prenom}</span>
        </h1>
        <p className="text-gray-400 mt-1 text-sm">Voici un aperçu de votre activité</p>
      </div>
{!user?.competences && (
  <div className="mb-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 flex items-center justify-between">
    <div className="flex items-center gap-3">
      <span className="text-2xl">⚡</span>
      <div>
        <p className="text-yellow-500 font-medium text-sm">Votre profil est vide !</p>
        <p className="text-gray-400 text-xs mt-0.5">Importez votre CV pour permettre à l'IA de personnaliser vos candidatures.</p>
      </div>
    </div>
    <button 
      onClick={() => navigate('/profil')}
      className="text-xs bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded-lg transition-colors"
    >
      Compléter mon profil
    </button>
  </div>
)}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Candidatures créées', value: candidatures.length, sub: 'Total' },
          { label: 'Score moyen', value: `${scoreMoyen}%`, sub: 'Compatibilité IA' },
          { label: 'Générées', value: candidatures.filter(c => c.statut === 'generee').length, sub: 'Documents prêts' },
        ].map((stat, i) => (
          <div key={i} className="bg-white/4 border border-white/8 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-primary/10 border border-primary/25 rounded-xl p-5 flex items-center justify-between mb-6">
        <div>
          <p className="text-white font-medium">Nouvelle candidature</p>
          <p className="text-gray-400 text-sm mt-1">Soumettez une offre, l'IA génère votre CV en 30 secondes</p>
        </div>
        <button
          onClick={() => navigate('/nouvelle-candidature')}
          className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap"
        >
          + Lancer la génération
        </button>
      </div>

      <div>
        <h2 className="text-sm font-medium text-gray-400 mb-3">Candidatures récentes</h2>
        {loading ? (
          <div className="text-center text-gray-500 py-8">Chargement...</div>
        ) : candidatures.length === 0 ? (
          <div className="text-center text-gray-500 py-8 bg-white/3 border border-white/8 rounded-xl">
            Aucune candidature pour l'instant
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {candidatures.slice(0, 5).map(c => (
              <div key={c.id} className="bg-white/3 border border-white/8 rounded-xl px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Candidature #{c.id.slice(0, 8)}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(c.date_creation).toLocaleDateString('fr-FR')} · Score {c.score_compatibilite || 0}%
                  </p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full border ${statusColor[c.statut] || statusColor['en_cours']}`}>
                  {statusLabel[c.statut] || 'En cours'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
