import { useState } from 'react'
import { offreAPI } from '../services/api'

export default function NouvelleCandidature() {
  const [url, setUrl] = useState('')
  const [contenu, setContenu] = useState('')
  const [isExtracting, setIsExtracting] = useState(false)
  const [step, setStep] = useState(1) // Pour gérer les étapes (1: Saisie, 2: Analyse)

  const handleExtraireOffre = async () => {
    if (!url) return
    setIsExtracting(true)
    try {
      const res = await offreAPI.extraire(url)
      setContenu(res.data.contenu)
    } catch (err) {
      alert("L'extraction automatique a échoué. Le site est peut-être protégé. Veuillez copier le texte manuellement.")
    } finally {
      setIsExtracting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Nouvelle candidature</h1>
        <div className="flex items-center gap-4 mt-4">
            <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-white/10'}`}></div>
            <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-white/10'}`}></div>
            <div className={`h-1 flex-1 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-white/10'}`}></div>
        </div>
      </div>

      <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
        <h2 className="text-white font-medium mb-4 italic">Étape 1 : Source de l'offre</h2>
        
        {/* CHAMP URL */}
        <label className="text-xs text-gray-400 mb-2 block">Lien de l'offre (Optionnel mais recommandé)</label>
        <div className="flex gap-2 mb-6">
          <input 
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.linkedin.com/jobs/view/..."
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary-light"
          />
          <button 
            type="button"
            onClick={handleExtraireOffre}
            disabled={isExtracting}
            className="bg-primary/20 hover:bg-primary/30 text-primary-light border border-primary/30 px-6 py-2 rounded-xl text-sm font-medium transition-all"
          >
            {isExtracting ? "Analyse..." : "Extraire"}
          </button>
        </div>

        {/* ZONE DE TEXTE */}
        <label className="text-xs text-gray-400 mb-2 block">Description de l'offre *</label>
        <textarea 
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          rows={12}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary-light resize-none"
          placeholder="Le contenu de l'offre apparaîtra ici ou collez-le manuellement..."
        />

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setStep(2)}
            disabled={!contenu || contenu.length < 50}
            className="bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-xl font-medium transition-all disabled:opacity-50"
          >
            Analyser avec l'IA →
          </button>
        </div>
      </div>
    </div>
  )
}