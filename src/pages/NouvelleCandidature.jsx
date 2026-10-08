import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import {
  AlertCircle,
  CheckCircle2,
  Download,
  Lightbulb,
  Loader2,
  MessageSquareText,
  Sparkles,
  Wand2,
} from 'lucide-react'
import { offreAPI, candidatureAPI } from '../services/api'

export default function NouvelleCandidature() {
  const [url, setUrl] = useState('')
  const [contenu, setContenu] = useState('')
  const [isExtracting, setIsExtracting] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isQuestioning, setIsQuestioning] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [analyseResult, setAnalyseResult] = useState(null)
  const [alignement, setAlignement] = useState(null)
  const [reponses, setReponses] = useState({})
  const [candidatureFinale, setCandidatureFinale] = useState(null)

  const questions = alignement?.questions || []
  const reponsesPayload = questions
    .map((question) => ({
      id: question.id,
      theme: question.theme,
      question: question.question,
      reponse: reponses[question.id]?.trim() || '',
    }))
    .filter((item) => item.reponse.length > 0)

  const handleExtraire = async () => {
    setIsExtracting(true)
    try {
      const res = await offreAPI.extraire(url)
      setContenu(res.data.contenu)
    } catch {
      alert("Erreur d'extraction")
    } finally {
      setIsExtracting(false)
    }
  }

  const handleAnalyseIA = async () => {
    setIsAnalyzing(true)
    setAlignement(null)
    setReponses({})
    try {
      const res = await offreAPI.soumettre({
        url_source: url,
        contenu_brut: contenu,
      })
      setAnalyseResult(res.data)

      setIsQuestioning(true)
      const questionsRes = await offreAPI.questionsAlignement(res.data.id)
      setAlignement(questionsRes.data)
    } catch {
      alert("L'IA n'a pas pu analyser l'offre. Verifiez votre profil.")
    } finally {
      setIsAnalyzing(false)
      setIsQuestioning(false)
    }
  }

  const handleGenererDocuments = async () => {
    setIsGenerating(true)
    try {
      const resCreate = await candidatureAPI.create(analyseResult.id)
      const candidatureId = resCreate.data.id
      const resGen = await candidatureAPI.generer(candidatureId, reponsesPayload)

      setCandidatureFinale({
        id: candidatureId,
        cv: resGen.data.cv,
        lettre: resGen.data.lettre,
      })
    } catch {
      alert('Erreur lors de la generation des documents.')
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadPDF = async (type) => {
    try {
      const response = await candidatureAPI.exportPdf(candidatureFinale.id, type)
      const blobUrl = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = blobUrl
      link.setAttribute('download', `${type === 'cv' ? 'CV' : 'Lettre'}_Candidature.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch {
      alert('Erreur lors de la generation du PDF.')
    }
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Nouvelle candidature</h1>
        <p className="text-gray-400 text-sm mt-1">
          Analysez l'offre, ajoutez les preuves qui manquent, puis generez une candidature alignee.
        </p>
      </div>

      {!analyseResult && (
        <div className="bg-white/3 border border-white/8 rounded-2xl p-6 space-y-6">
          <div>
            <label className="text-xs text-gray-400 mb-2 block">Lien de l'offre</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Collez le lien LinkedIn, Indeed ou le site de l'entreprise..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-primary-light outline-none"
              />
              <button
                onClick={handleExtraire}
                disabled={isExtracting || !url.trim()}
                className="bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-xl text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isExtracting ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                Extraire
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-2 block">Description de l'offre</label>
            <textarea
              value={contenu}
              onChange={(e) => setContenu(e.target.value)}
              rows={10}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-primary-light resize-none"
              placeholder="Collez ici le contenu de l'offre si l'extraction automatique ne suffit pas..."
            />
          </div>

          <button
            onClick={handleAnalyseIA}
            disabled={isAnalyzing || contenu.length < 50}
            className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="animate-spin" size={20} /> Analyse en cours...
              </>
            ) : (
              <>
                <CheckCircle2 size={20} /> Lancer l'analyse de compatibilite
              </>
            )}
          </button>
        </div>
      )}

      {analyseResult && !candidatureFinale && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
              <span className="text-gray-400 text-xs uppercase font-bold mb-4">Score match</span>
              <div className="relative flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90" aria-hidden="true">
                  <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/5" />
                  <circle
                    cx="64"
                    cy="64"
                    r="58"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
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
              <InsightBox
                tone="green"
                icon={<CheckCircle2 size={14} />}
                title="Points forts"
                items={analyseResult.points_forts}
              />
              <InsightBox
                tone="red"
                icon={<AlertCircle size={14} />}
                title="Points a clarifier"
                items={analyseResult.points_manquants}
              />
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6 flex gap-4 items-start">
            <div className="bg-primary/20 p-3 rounded-lg text-primary-light">
              <Lightbulb />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm mb-1">Conseil strategique de l'IA</h4>
              <p className="text-gray-400 text-sm leading-relaxed italic">"{analyseResult.conseil_ia}"</p>
            </div>
          </div>

          <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
            <div className="flex items-start gap-3 mb-5">
              <div className="bg-white/10 p-2.5 rounded-lg text-primary-light">
                <MessageSquareText size={20} />
              </div>
              <div>
                <h3 className="text-white font-bold">Affiner l'alignement</h3>
                <p className="text-gray-400 text-sm mt-1">
                  {isQuestioning
                    ? "L'IA prepare les questions les plus utiles..."
                    : alignement?.diagnostic || 'Ajoutez les elements que le CV ne dit pas encore.'}
                </p>
              </div>
            </div>

            {isQuestioning ? (
              <div className="flex items-center gap-2 text-gray-400 text-sm py-8">
                <Loader2 className="animate-spin" size={18} /> Preparation des questions...
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question) => (
                  <div key={question.id} className="bg-white/4 border border-white/8 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[11px] uppercase tracking-wide text-primary-light font-bold">
                        {question.theme}
                      </span>
                    </div>
                    <label className="text-sm text-white font-medium block mb-2">
                      {question.question}
                    </label>
                    <textarea
                      value={reponses[question.id] || ''}
                      onChange={(e) => setReponses({ ...reponses, [question.id]: e.target.value })}
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm outline-none focus:border-primary-light resize-none"
                      placeholder={question.aide || 'Votre reponse...'}
                    />
                  </div>
                ))}

                <button
                  onClick={handleGenererDocuments}
                  disabled={isGenerating || isQuestioning}
                  className="w-full bg-white text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all shadow-xl disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="animate-spin" size={20} /> Redaction en cours...
                    </>
                  ) : (
                    <>
                      <Wand2 size={20} /> Generer mon CV et ma lettre personnalises
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {candidatureFinale && (
        <div className="space-y-6 animate-in zoom-in-95 duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="inline-flex w-fit bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-medium border border-green-500/30">
              Documents rediges avec succes
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <DownloadButton onClick={() => downloadPDF('cv')} label="Telecharger le CV" />
              <DownloadButton onClick={() => downloadPDF('lettre')} label="Telecharger la lettre" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DocumentPreview title="CV optimise" content={candidatureFinale.cv} className="markdown-cv" />
            <DocumentPreview title="Lettre de motivation" content={candidatureFinale.lettre} className="markdown-letter" />
          </div>
        </div>
      )}
    </div>
  )
}

function InsightBox({ tone, icon, title, items = [] }) {
  const tones = {
    green: 'bg-green-500/10 border-green-500/20 text-green-400',
    red: 'bg-red-500/10 border-red-500/20 text-red-400',
  }

  return (
    <div className={`${tones[tone]} border rounded-2xl p-5`}>
      <h4 className="text-xs font-bold uppercase mb-3 flex items-center gap-2">
        {icon} {title}
      </h4>
      <ul className="text-sm text-gray-300 space-y-2">
        {items?.map((item, index) => (
          <li key={index}>- {item}</li>
        ))}
      </ul>
    </div>
  )
}

function DownloadButton({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      className="bg-primary text-white px-4 py-2.5 rounded-lg font-bold hover:bg-primary-dark transition-all flex items-center justify-center gap-2 text-sm"
    >
      <Download size={16} /> {label}
    </button>
  )
}

function DocumentPreview({ title, content, className }) {
  return (
    <section>
      <h2 className="text-sm font-medium text-gray-400 mb-3">{title}</h2>
      <div className="bg-white p-8 rounded-sm shadow-2xl overflow-y-auto max-h-[700px] border-t-4 border-primary">
        <div className={className}>
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>
    </section>
  )
}
