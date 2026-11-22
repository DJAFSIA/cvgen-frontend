// Inter, la police du site (version 4.001, licence SIL OFL : public/fonts/OFL.txt), lue depuis les
// fichiers du projet : le rendu ne dépend d'aucun téléchargement. Les octets sont récupérés par fetch
// puis donnés à FontFace (police prête sans passer par le chargeur de polices du navigateur).
// Le chargement est lancé par le composant du film (usePolices) : un delayRender posé hors composant,
// au chargement du module, n'était pas toujours levé dans les onglets de rendu (expiration après 28 s).
// Le rendu attend les quatre graisses et s'arrête si l'une manque : jamais de police de repli.
import { useEffect, useState } from 'react';
import { cancelRender, continueRender, delayRender, staticFile } from 'remotion';

const FICHIERS: [number, string][] = [
  [400, 'Inter-Regular.ttf'],
  [500, 'Inter-Medium.ttf'],
  [600, 'Inter-SemiBold.ttf'],
  [700, 'Inter-Bold.ttf'],
];

let chargement: Promise<void> | null = null;

/** Charge les quatre graisses une seule fois par onglet. */
const chargerPolices = () => {
  chargement ??= Promise.all(
    FICHIERS.map(async ([graisse, fichier]) => {
      const reponse = await fetch(staticFile(`fonts/${fichier}`));
      if (!reponse.ok) throw new Error(`Police introuvable : fonts/${fichier} (${reponse.status})`);
      const face = new FontFace('Inter', await reponse.arrayBuffer(), { weight: String(graisse) });
      document.fonts.add(await face.load());
    }),
  ).then(() => undefined);
  return chargement;
};

/** A appeler en tete du composant du film : aucune image n'est rendue avant que Inter soit prete. */
export const usePolices = () => {
  const [attente] = useState(() => delayRender('Chargement de la police Inter'));
  useEffect(() => {
    chargerPolices()
      .then(() => continueRender(attente))
      .catch((e) => cancelRender(e));
  }, [attente]);
};
