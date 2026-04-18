import { useState } from 'react'
import { offreAPI, candidatureAPI } from '../services/api'

const STEPS = ['Offre d\'emploi', 'Analyse IA', 'Documents générés']

export default function NouvelleCandidature() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [contenuOffre, setContenuOffre] = useState('')
  const [urlOffre, setUrlOffre] = useState('')
  const [offre, setOffre] = useState(null)
  const [documents, setDocuments] = useState(null)
  const [candidatureId, setCandidatureId] = useState(null)

  const handleAnalyser = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await offreAPI.create({ url_source: urlOffre, contenu_brut: contenuOffre })
      setOffre(res.data)
      const candRes = await candidatureAPI.create({ offre_id: res.data.id })
      setCandidatureId(candRes.data.id)
      setStep(1)
    } catch {
      setError('Erreur lors de l\'analyse. Vérifiez votre connexion.')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerer = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await candidatureAPI.generer(candidatureId, {
        candidature_id: candidatureId,
        modele_cv: 'classique',
        ton_lettre: 'professionnel',
      })
      setDocuments(res.data)
      setStep(2)
    } catch {
      setError('Erreur lors de la génération.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Nouvelle candidature</h1>
        <p className="text-gray-400 text-sm mt-1">Soumettez une offre et laissez l'IA faire le travail</p>
      </div>

      <div className="flex items-center gap-0 mb-8">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                i < step ? 'bg-green-500 text-white' :
                i === step ? 'bg-primary text-white' :
                'bg-white/10 text-gray-500'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-sm ${i === step ? 'text-white font-medium' : 'text-gray-500'}`}>{s}</span>
            </div>
            {i < STEPS.length - 1 && <div className="flex-1 h-px bg-white/10 mx-3" />}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      {step === 0 && (
        <div className="bg-white/3 border border-white/8 rounded-xl p-6">
          <h2 className="text-white font-medium mb-4">Soumettre une offre d'emploi</h2>
          <form onSubmit={handleAnalyser} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Lien de l'offre (optionnel)</label>
              <input
                type="url"
                placeholder="https://linkedin.com/jobs/..."
                value={urlOffre}
                onChange={e => setUrlOffre(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary-light"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Contenu de l'offre *</label>
              <textarea
                placeholder="Copiez-collez le contenu de l'offre d'emploi ici..."
                value={contenuOffre}
                onChange={e => setContenuOffre(e.target.value)}
                rows={8}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-primary-light resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
            >
              {loading ? 'Analyse en cours...' : 'Analyser l\'offre avec l\'IA →'}
            </button>
          </form>
        </div>
      )}

      {step === 1 && offre && (
        <div className="space-y-4">
          <div className="bg-white/3 border border-white/8 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-medium">Résultat de l'analyse IA</h2>
              <span className="bg-green-500/20 border border-green-500/30 text-green-400 text-xs px-3 py-1 rounded-full">
                Score : {offre.score_compatibilite || 0}%
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Poste</p>
                <p className="text-white text-sm font-medium">{offre.titre_poste || 'Non détecté'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Entreprise</p>
                <p className="text-white text-sm font-medium">{offre.entreprise || 'Non détectée'}</p>
              </div>
            </div>
            {offre.mots_cles && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Mots-clés extraits</p>
                <div className="flex flex-wrap gap-2">
                  {offre.mots_cles.split(',').map((kw, i) => (
                    <span key={i} className="bg-primary/15 border border-primary/25 text-primary-light text-xs px-2.5 py-1 rounded-full">
                      {kw.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleGenerer}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
          >
            {loading ? 'Génération en cours...' : '🤖 Générer CV + Lettre de motivation'}
          </button>
        </div>
      )}

      {step === 2 && documents && (
        <div className="space-y-4">
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 text-center">
            <p className="text-green-400 font-medium">Documents générés avec succès !</p>
          </div>
          <div className="bg-white/3 border border-white/8 rounded-xl p-6">
            <h3 className="text-white font-medium mb-3">CV généré</h3>
            <pre className="text-gray-300 text-xs whitespace-pre-wrap leading-relaxed max-h-64 overflow-auto bg-black/20 rounded-lg p-4">
              {documents.cv}
            </pre>
          </div>
          <div className="bg-white/3 border border-white/8 rounded-xl p-6">
            <h3 className="text-white font-medium mb-3">Lettre de motivation</h3>
            <pre className="text-gray-300 text-xs whitespace-pre-wrap leading-relaxed max-h-64 overflow-auto bg-black/20 rounded-lg p-4">
              {documents.lettre_motivation}
            </pre>
          </div>
          <button
            onClick={() => { setStep(0); setContenuOffre(''); setUrlOffre(''); setOffre(null); setDocuments(null); }}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-xl text-sm transition-all"
          >
            Nouvelle candidature
          </button>
        </div>
      )}
    </div>
  )
}
