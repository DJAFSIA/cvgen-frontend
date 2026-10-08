// Le profil est stocke de facon structuree (import de CV) ou en texte libre (saisie manuelle).
// Le formulaire edite du texte : on convertit les structures en texte lisible.

const lignes = (...parts) => parts.filter(Boolean).join('\n')

function experienceEnTexte(e) {
  if (typeof e === 'string') return e
  const entete = `${e.poste || ''}${e.entreprise ? ` @ ${e.entreprise}` : ''}${e.date ? ` (${e.date})` : ''}`
  const details = Array.isArray(e.description) ? e.description.map((d) => `- ${d}`).join('\n') : e.description
  return lignes(entete, e.lieu, details)
}

function formationEnTexte(f) {
  if (typeof f === 'string') return f
  const entete = `${f.diplome || ''}${f.etablissement ? ` @ ${f.etablissement}` : ''}${f.date ? ` (${f.date})` : ''}`
  return lignes(entete, f.lieu)
}

function listeEnTexte(valeur, formateur) {
  if (valeur == null) return ''
  if (Array.isArray(valeur)) return valeur.map(formateur).join('\n\n')
  return typeof valeur === 'string' ? valeur : formateur(valeur)
}

export const FIELDS = [
  'nom_complet_cv', 'email_cv', 'telephone', 'adresse', 'titre_profil',
  'experiences', 'formations', 'competences', 'langues',
]

export function profilVersFormulaire(profil = {}) {
  const texte = (v) => (Array.isArray(v) ? v.join(', ') : v || '')
  return {
    nom_complet_cv: texte(profil.nom_complet_cv),
    email_cv: texte(profil.email_cv),
    telephone: texte(profil.telephone),
    adresse: texte(profil.adresse),
    titre_profil: texte(profil.titre_profil),
    experiences: listeEnTexte(profil.experiences, experienceEnTexte),
    formations: listeEnTexte(profil.formations, formationEnTexte),
    competences: texte(profil.competences),
    langues: texte(profil.langues),
  }
}
