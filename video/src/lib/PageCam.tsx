// Camera 2,5D sur une capture de page entiere (repris de demos/_fixtures/PageCam2D.tsx).
// (cx, cy) = point de la page place au centre de l'ecran ; zoom ; rotX/rotY/rotZ/persp en option.
// Le zoom passe par la propriete CSS zoom (agrandissement de mise en page) : le texte reste net (Q2).
import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { CAMERA } from './motion';

export type Cle = { frame: number; cx: number; cy: number; zoom: number; rotX?: number; rotY?: number; rotZ?: number; persp?: number };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function poseCamera(keys: Cle[], frame: number, ease: (t: number) => number = CAMERA) {
  let a = keys[0];
  let b = keys[keys.length - 1];
  if (frame <= keys[0].frame) b = a;
  for (let i = 0; i < keys.length - 1; i++) {
    if (frame >= keys[i].frame && frame <= keys[i + 1].frame) {
      a = keys[i];
      b = keys[i + 1];
      break;
    }
  }
  const t = a.frame === b.frame ? 1 : interpolate(frame, [a.frame, b.frame], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease,
  });
  return {
    cx: lerp(a.cx, b.cx, t),
    cy: lerp(a.cy, b.cy, t),
    zoom: lerp(a.zoom, b.zoom, t),
    rotX: lerp(a.rotX ?? 0, b.rotX ?? 0, t),
    rotY: lerp(a.rotY ?? 0, b.rotY ?? 0, t),
    rotZ: lerp(a.rotZ ?? 0, b.rotZ ?? 0, t),
    persp: lerp(a.persp ?? 1400, b.persp ?? 1400, t),
  };
}

export const PageCam: React.FC<{
  src: string;
  pageH: number;
  keys: Cle[];
  children?: React.ReactNode;
  bg?: string;
  blur?: number;
  ease?: (t: number) => number;
}> = ({ src, pageH, keys, children, bg = '#f5f5f7', blur = 0, ease }) => {
  const frame = useCurrentFrame();
  const { cx, cy, zoom, rotX, rotY, rotZ, persp } = poseCamera(keys, frame, ease);
  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: bg }}>
      <div style={{ position: 'absolute', inset: 0, perspective: `${persp * zoom}px`, perspectiveOrigin: '960px 540px' }}>
        <div
          style={{
            position: 'absolute',
            width: 1920,
            height: pageH,
            zoom,
            transform: `translate(${960 / zoom - cx}px, ${540 / zoom - cy}px) rotateY(${rotY}deg) rotateX(${rotX}deg) rotateZ(${rotZ}deg)`,
            transformOrigin: `${cx}px ${cy}px`,
            transformStyle: 'preserve-3d',
            filter: blur > 0 ? `blur(${blur}px)` : undefined,
          }}
        >
          <Img src={staticFile(src)} style={{ position: 'absolute', width: 1920, height: pageH, maxWidth: 'none' }} />
          {children}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export type Rect = { x: number; y: number; w: number; h: number };

/** Un morceau d'une capture de page, a sa place (coordonnees de page). */
export const Morceau: React.FC<{ src: string; pageH: number; r: Rect; pad?: number; style?: React.CSSProperties; rayon?: number }> = ({
  src, pageH, r, pad = 0, style, rayon = 0,
}) => (
  <div style={{ position: 'absolute', left: r.x - pad, top: r.y - pad, width: r.w + 2 * pad, height: r.h + 2 * pad, overflow: 'hidden', borderRadius: rayon, ...style }}>
    <Img src={staticFile(src)} style={{ position: 'absolute', left: -(r.x - pad), top: -(r.y - pad), width: 1920, height: pageH, maxWidth: 'none' }} />
  </div>
);
