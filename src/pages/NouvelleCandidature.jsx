import { useState } from 'react'
import { offreAPI, candidatureAPI } from '../services/api' // Ajout de candidatureAPI
import { 
  CheckCircle2, 
  AlertCircle, 
  Lightbulb, 
  ArrowRight, 
  Loader2, 
  Wand2, 
  FileText, 
  Download 
} from 'lucide-react'

export default function NouvelleCandidature() {
  const [url, setUrl] = useState('')
  const [contenu, setContenu] = useState('')
  const [isExtracting, setIsExtracting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false) // État pour la phase 4
  const [analyseResult, setAnalyseResult] = useState(null)
  const [candidatureFinale, setCandidatureFinale] = useState(null) // Stocke les docs générés

  // Étape 1 : Extraire le texte via l'URL
  const handleExtraire = async () => {
    setIsExtracting(true)
    try {
      const res = await offreAPI.extraire(url)
      setContenu(res.data.contenu)
    } catch (err) { alert("Erreur d'extraction") }
    finally { setIsExtracting(false) }
  }

  // Étape 2 : Lancer l'analyse IA
  const handleAnalyseIA = async () => {
    setIsAnalyzing(true)
    try {
      const res = await offreAPI.soumettre({ 
        url_source: url, 
        contenu_brut: contenu 
      })
      setAnalyseResult(res.data)
    } catch (err) {
      alert("L'IA n'a pas pu analyser l'offre. Vérifiez votre profil.")
    } finally { setIsAnalyzing(false) }
  }

  // Étape 3 : Générer le CV et la Lettre (Phase 4)
  const handleGenererDocuments = async () => {
    setIsGenerating(true)
    try {
      // A. Créer la candidature liée à l'offre
      const resCreate = await candidatureAPI.create(analyseResult.id)
      const candidatureId = resCreate.data.id

      // B. Lancer la rédaction par l'IA
      const resGen = await candidatureAPI.generer(candidatureId)
      
      setCandidatureFinale({
        id: candidatureId,
        cv: resGen.data.cv,
        lettre: resGen.data.lettre
      })
    } catch (err) {
      alert("Erreur lors de la génération des documents.")
    } finally {
      setIsGenerating(false)
    }
  }

  // Étape 4 : Télécharger en PDF
  const downloadPDF = async (type) => {
    try {
      const response = await candidatureAPI.exportPdf(candidatureFinale.id, type)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `${type === 'cv' ? 'CV' : 'Lettre'}_Candidature.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      alert("Erreur lors de la génération du PDF.")
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <h1 className="text-2xl font-bold text-white mb-8">Nouvelle candidature</h1>

      {/* BLOC SAISIE (Étape 1 & 2) */}
      {!analyseResult && (
        <div className="bg-white/3 border border-white/8 rounded-2xl p-6 space-y-6">
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Lien de l'offre</label>
            <div className="flex gap-2">
              <input 
                type="text" value={url} onChange={e => setUrl(e.target.value)}
                placeholder="Collez le lien LinkedIn ou Indeed..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-primary-light outline-none"
              />
              <button onClick={handleExtraire} disabled={isExtracting} className="bg-white/10 hover:bg-white/20 text-white px-6 rounded-xl text-sm transition-all">
                {isExtracting ? <Loader2 className="animate-spin" /> : "Extraire"}
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-2 block">Description de l'offre</label>
            <textarea 
              value={contenu} onChange={e => setContenu(e.target.value)}
              rows={10} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-primary-light resize-none"
              placeholder="Contenu de l'offre..."
            />
          </div>

          <button 
            onClick={handleAnalyseIA} 
            disabled={isAnalyzing || contenu.length < 50}
            className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isAnalyzing ? <><Loader2 className="animate-spin" /> Analyse en cours...</> : <><CheckCircle2 size={20} /> Lancer l'analyse de compatibilité</>}
          </button>
        </div>
      )}

      {/* RÉSULTATS DE L'ANALYSE (Étape 3) */}
      {analyseResult && !candidatureFinale && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <span className="text-gray-400 text-xs uppercase font-bold mb-4">Score Match</span>
              <div className="relative flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
                    strokeDasharray={364.4} 
                    strokeDashoffset={364.4 - (364.4 * analyseResult.score_compatibilite) / 100}
                    className="text-primary-light stroke-round transition-all duration-1000" 
                  />
                </svg>
                <span className="absolute text-3xl font-bold text-white">{analyseResult.score_compatibilite}%</span>
              </div>
              <p className="mt-4 text-sm text-white font-medium">{analyseResult.titre_poste}</p>
              <p className="text-gray-500 text-xs">{analyseResult.entreprise}</p>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5">
                <h4 className="text-green-400 text-xs font-bold uppercase mb-3 flex items-center gap-2">
                  <CheckCircle2 size={14} /> Vos Points Forts
                </h4>
                <ul className="text-sm text-gray-300 space-y-2">
                  {analyseResult.points_forts?.map((p, i) => <li key={i}>• {p}</li>)}
                </ul>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
                <h4 className="text-red-400 text-xs font-bold uppercase mb-3 flex items-center gap-2">
                  <AlertCircle size={14} /> Compétences manquantes
                </h4>
                <ul className="text-sm text-gray-300 space-y-2">
                  {analyseResult.points_manquants?.map((p, i) => <li key={i}>• {p}</li>)}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 flex gap-4 items-start">
            <div className="bg-primary/20 p-3 rounded-lg text-primary-light"><Lightbulb /></div>
            <div>
              <h4 className="text-white font-bold text-sm mb-1">Conseil stratégique de l'IA</h4>
              <p className="text-gray-400 text-sm leading-relaxed italic">"{analyseResult.conseil_ia}"</p>
            </div>
          </div>

          <button 
            onClick={handleGenererDocuments}
            disabled={isGenerating}
            className="w-full bg-white text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all shadow-xl"
          >
            {isGenerating ? <><Loader2 className="animate-spin" /> Rédaction en cours...</> : <><Wand2 size={20} /> Générer mon CV et ma Lettre personnalisés</>}
          </button>
        </div>
      )}

      {/* DOCUMENTS GÉNÉRÉS (Étape 4) */}
      {candidatureFinale && (
        <div className="space-y-8 animate-in zoom-in-95 duration-500">
          <div className="text-center">
            <div className="inline-flex bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium border border-green-500/30 mb-4">
              ✨ Documents rédigés avec succès !
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CV PREVIEW */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <FileText size={18} className="text-primary-light" /> Curriculum Vitae
              </h3>
              <div className="flex-1 bg-black/30 p-4 rounded-xl border border-white/5 text-[10px] text-gray-400 font-mono h-80 overflow-y-auto whitespace-pre-wrap">
                {candidatureFinale.cv}
              </div>
              <button 
                onClick={() => downloadPDF('cv')}
                className="w-full mt-4 bg-white text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all"
              >
                <Download size={18} /> Télécharger le CV (PDF)
              </button>
            </div>

            {/* LETTRE PREVIEW */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
              <h3 className="text-white font-medium mb-4 flex items-center gap-2">
                <FileText size={18} className="text-primary-light" /> Lettre de Motivation
              </h3>
              <div className="flex-1 bg-black/30 p-4 rounded-xl border border-white/5 text-[10px] text-gray-400 font-mono h-80 overflow-y-auto whitespace-pre-wrap">
                {candidatureFinale.lettre}
              </div>
              <button 
                onClick={() => downloadPDF('lettre')}
                className="w-full mt-4 bg-white text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all"
              >
                <Download size={18} /> Télécharger la Lettre (PDF)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}