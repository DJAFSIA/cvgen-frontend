import { Download, FileText, Loader2, Wand2 } from 'lucide-react';
import { candidatureAPI } from '../services/api';

// ... à l'intérieur de ton composant ...
const [isGenerating, setIsGenerating] = useState(false);
const [candidatureFinale, setCandidatureFinale] = useState(null);

const handleGenererDocuments = async () => {
  setIsGenerating(true);
  try {
    // Étape A : Créer la candidature en base
    const resCreate = await candidatureAPI.create(analyseResult.id);
    const candidatureId = resCreate.data.id;

    // Étape B : Lancer la rédaction IA
    const resGen = await candidatureAPI.generer(candidatureId);
    
    // On stocke les textes générés et l'ID pour l'affichage
    setCandidatureFinale({
      id: candidatureId,
      cv: resGen.data.cv,
      lettre: resGen.data.lettre
    });
  } catch (err) {
    alert("Erreur lors de la génération des documents.");
  } finally {
    setIsGenerating(false);
  }
};

// Fonction pour télécharger le PDF
const downloadPDF = async (type) => {
  try {
    const response = await candidatureAPI.exportPdf(candidatureFinale.id, type);
    
    // Création d'un lien temporaire pour le téléchargement
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${type === 'cv' ? 'CV' : 'Lettre'}_Candidature.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (err) {
    alert("Erreur lors du téléchargement du PDF.");
  }
};

// --- DANS TON RENDU JSX ---
// Juste après le bloc du score et du conseil de l'IA :

{!candidatureFinale ? (
  <button 
    onClick={handleGenererDocuments}
    disabled={isGenerating || !analyseResult}
    className="w-full mt-8 bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-primary/20"
  >
    {isGenerating ? (
      <><Loader2 className="animate-spin" /> L'IA rédige vos documents...</>
    ) : (
      <><Wand2 size={20} /> Rédiger mon CV et ma Lettre personnalisés</>
    )}
  </button>
) : (
  <div className="mt-12 space-y-8 animate-in slide-in-from-bottom-8 duration-700">
    <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-white/10"></div>
        <h2 className="text-xl font-bold text-white">Vos documents personnalisés</h2>
        <div className="h-px flex-1 bg-white/10"></div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* APERÇU CV */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium flex items-center gap-2">
            <FileText size={18} className="text-primary-light" /> Curriculum Vitae
          </h3>
        </div>
        <div className="flex-1 text-gray-400 text-[10px] leading-relaxed h-80 overflow-y-auto bg-black/30 p-4 rounded-xl border border-white/5 font-mono whitespace-pre-wrap mb-4">
          {candidatureFinale.cv}
        </div>
        <button 
          onClick={() => downloadPDF('cv')}
          className="w-full bg-white text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all"
        >
          <Download size={18} /> Télécharger le CV (PDF)
        </button>
      </div>

      {/* APERÇU LETTRE */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium flex items-center gap-2">
            <FileText size={18} className="text-primary-light" /> Lettre de Motivation
          </h3>
        </div>
        <div className="flex-1 text-gray-400 text-[10px] leading-relaxed h-80 overflow-y-auto bg-black/30 p-4 rounded-xl border border-white/5 font-mono whitespace-pre-wrap mb-4">
          {candidatureFinale.lettre}
        </div>
        <button 
          onClick={() => downloadPDF('lettre')}
          className="w-full bg-white text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all"
        >
          <Download size={18} /> Télécharger la Lettre (PDF)
        </button>
      </div>
    </div>
  </div>
)}