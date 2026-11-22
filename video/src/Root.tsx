import React from 'react';
import { Composition } from 'remotion';
import { Film, type FilmProps } from './Film';
import { DUREE_TOTALE } from './timeline';

const DEFAUT: FilmProps = { lang: 'fr', bgm: true };

export const Root: React.FC = () => (
  <Composition id="ApplyFilm" component={Film} durationInFrames={DUREE_TOTALE} fps={30} width={1920} height={1080} defaultProps={DEFAUT} />
);
