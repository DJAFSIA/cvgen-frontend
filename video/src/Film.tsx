// Montage du film. SHOTS est la seule source de verite du minutage : sous-titres, transitions
// et sons en derivent (references/workbench.md §2).
import React from 'react';
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from 'remotion';
import { Legende } from './lib/Legende';
import { usePolices } from './lib/polices';
import { TEXTES, type Lang } from './textes';
import { Documents } from './shots/Documents';
import { Final } from './shots/Final';
import { Langues } from './shots/Langues';
import { Modeles } from './shots/Modeles';
import { Offre } from './shots/Offre';
import { Ouverture } from './shots/Ouverture';
import { Profil } from './shots/Profil';
import { Questions } from './shots/Questions';
import { Score } from './shots/Score';
import { Titre } from './shots/Titre';
import { Sons } from './Sons';
import { SHOTS } from './timeline';

export { DUREE_TOTALE, SHOTS } from './timeline';

export type FilmProps = { lang: Lang; bgm: boolean };

export const LEGENDES: { shot: keyof typeof SHOTS; cle: 'profil' | 'offre' | 'score' | 'questions' | 'documents' | 'modeles' }[] = [
  { shot: 'profil', cle: 'profil' },
  { shot: 'offre', cle: 'offre' },
  { shot: 'score', cle: 'score' },
  { shot: 'questions', cle: 'questions' },
  { shot: 'documents', cle: 'documents' },
  { shot: 'modeles', cle: 'modeles' },
];

/** Entree et sortie de chaque plan : fondu court par le blanc, legere poussee en sortie. */
const Enveloppe: React.FC<{ dur: number; entree?: boolean; sortie?: boolean; children: React.ReactNode }> = ({ dur, entree = true, sortie = true, children }) => {
  const f = useCurrentFrame();
  const a = entree ? interpolate(f, [0, 8], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 1;
  const b = sortie ? interpolate(f, [dur - 6, dur], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 1;
  const pousse = sortie ? interpolate(f, [dur - 6, dur], [1, 1.025], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 1;
  return <AbsoluteFill style={{ opacity: a * b, transform: `scale(${pousse})` }}>{children}</AbsoluteFill>;
};

const Flash: React.FC = () => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 4, 10], [0, 0.9, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return <AbsoluteFill style={{ opacity: o, background: 'radial-gradient(ellipse at 50% 45%, #ffffff, rgba(255,255,255,0.7) 55%, rgba(255,255,255,0) 85%)' }} />;
};

export const Film: React.FC<FilmProps> = ({ lang, bgm }) => {
  usePolices();
  const S = SHOTS;
  const plan = (k: keyof typeof SHOTS, contenu: React.ReactNode, opts: { entree?: boolean; sortie?: boolean } = {}) => (
    <Sequence key={k} from={S[k].from} durationInFrames={S[k].dur} name={k}>
      <Enveloppe dur={S[k].dur} {...opts}>{contenu}</Enveloppe>
    </Sequence>
  );
  return (
    <AbsoluteFill style={{ background: '#fff' }}>
      {plan('ouverture', <Ouverture lang={lang} />, { entree: false })}
      {plan('profil', <Profil lang={lang} />)}
      {plan('offre', <Offre lang={lang} />)}
      {plan('score', <Score lang={lang} />)}
      {plan('questions', <Questions lang={lang} />)}
      {plan('titre', <Titre lang={lang} />)}
      {plan('documents', <Documents lang={lang} />)}
      {plan('langues', <Langues lang={lang} />)}
      {plan('modeles', <Modeles lang={lang} />, { sortie: false })}
      {plan('final', <Final lang={lang} />, { entree: false, sortie: false })}
      <Sequence from={S.final.from - 5} durationInFrames={10} name="flash">
        <Flash />
      </Sequence>
      {LEGENDES.map(({ shot, cle }) => (
        <Sequence key={`leg-${shot}`} from={S[shot].from + 8} durationInFrames={S[shot].dur - 14} name={`legende-${shot}`}>
          <Legende texte={TEXTES[lang][cle]} duree={S[shot].dur - 14} />
        </Sequence>
      ))}
      <Sons bgm={bgm} lang={lang} />
    </AbsoluteFill>
  );
};
