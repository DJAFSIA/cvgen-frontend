import { useState, useEffect, useRef } from 'react'
import { profilAPI } from '../services/api'
import { useNavigate } from 'react-router-dom' 
import { useAuth } from '../context/AuthContext' // <--- Ajouté

export default function ProfilPage() {
  const navigate = useNavigate()
  const { user, setUser } = useAuth() // <--- Récupération du contexte
  
  const [profil, setProfil] = useState({
    titre_profil: '', 
    experiences: '', 
    formations: '',
    competences: '', 
    langues: '',
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [success, setSuccess] = useState(null)

  const fileInputRef = useRef(null)

  useEffect(() => {
    profilAPI.get()
      .then(res => setProfil(res.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleImportCV = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const formData = new FormData()
    formData.append('file', file)

    setIsAnalyzing(true)
    setSuccess(null)
    try {
      const res = await profilAPI.importCV(formData)
      // On met à jour l'état local avec les données renvoyées par le backend
      const nouvellesDonnees = res.data.data
      setProfil(prev => ({
        ...prev,
        ...nouvellesDonnees 
      }))
      setSuccess("✨ L'IA a analysé votre CV et rempli le formulaire !")
    } catch (err) {
      alert("Erreur lors de l'analyse du CV")
    } finally {
      setIsAnalyzing(false)
      e.target.value = null
    }
  }

 const handleSave = async (e) => {
  e.preventDefault()
  setSaving(true)
  setSuccess(null)
  try {
    const res = await profilAPI.update(profil)
    
    // CORRECTIF ICI : 
    // On utilise une fonction pour être sûr d'avoir l'état précédent (prev)
    // On garde tout ce qu'il y avait avant (...prev) 
    // et on ajoute les résultats du profil (...res.data)
    setUser(prev => ({ 
      ...prev, 
      ...res.data 
    })) 

    // On met aussi à jour le localStorage en fusionnant
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
    const updatedUser = { ...currentUser, ...res.data }
    localStorage.setItem('user', JSON.stringify(updatedUser))

    setSuccess("✅ Profil sauvegardé ! Redirection...")
    setTimeout(() => navigate('/'), 2000)
  } catch (err) {
    console.error(err)
    alert("Erreur lors de la sauvegarde")
  } finally {
    setSaving(false)
  }
}
  if (loading) return <div className="text-center text-gray-500 py-12">Chargement du profil...</div>

  const fields = [
    { key: 'titre_profil', label: 'Titre professionnel', placeholder: 'Ex: Développeur Full Stack', type: 'input' },
    { key: 'formations', label: 'Formations', placeholder: 'Vos diplômes...', type: 'textarea' },
    { key: 'experiences', label: 'Expériences professionnelles', placeholder: 'Vos anciens postes...', type: 'textarea' },
    { key: 'competences', label: 'Compétences techniques', placeholder: 'Python, React, etc.', type: 'textarea' },
    { key: 'langues', label: 'Langues', placeholder: 'Français, Anglais...', type: 'input' },
  ]

  return (
    <div className="max-w-2xl mx-auto pb-10 px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Mon profil</h1>
        <p className="text-gray-400 text-sm mt-1">Ces informations seront utilisées pour personnaliser vos candidatures</p>
      </div>

      <div className="mb-8 p-6 bg-primary/10 border border-dashed border-primary/40 rounded-2xl text-center">
        <div className="text-2xl mb-2">✨</div>
        <h3 className="text-white font-medium text-sm">Remplissage automatique</h3>
        <p className="text-gray-400 text-xs mt-1 mb-4">Importez un PDF pour remplir les champs ci-dessous</p>
        
        <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleImportCV} />
        
        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          disabled={isAnalyzing}
          className="bg-primary/20 hover:bg-primary/30 text-primary-light border border-primary/30 px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 mx-auto"
        >
          {isAnalyzing ? "🌀 Analyse en cours..." : "📄 Importer mon CV PDF"}
        </button>
      </div>

      {success && (
        <div className="bg-green-500/20 border border-green-500/30 text-green-400 text-sm px-4 py-3 rounded-xl mb-6">
          {success}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        {fields.map(field => (
          <div key={field.key} className="bg-white/3 border border-white/8 rounded-xl p-4">
            <label className="text-xs text-gray-400 mb-2 block">{field.label}</label>
            {field.type === 'input' ? (
              <input
                type="text"
                placeholder={field.placeholder}
                value={profil[field.key] || ''}
                onChange={e => setProfil({...profil, [field.key]: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary-light"
              />
            ) : (
              <textarea
                placeholder={field.placeholder}
                value={profil[field.key] || ''}
                onChange={e => setProfil({...profil, [field.key]: e.target.value})}
                rows={4}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-primary-light resize-none"
              />
            )}
          </div>
        ))}
        
        <button
          type="submit"
          disabled={saving || isAnalyzing}
          className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl text-sm font-medium transition-all disabled:opacity-50"
        >
          {saving ? 'Sauvegarde...' : 'Sauvegarder le profil'}
        </button>
      </form>
    </div>
  )
}