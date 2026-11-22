// Images de controle : un seul empaquetage, puis une image fixe par numero demande (pipeline P1).
// Usage : node scripts/images-controle.mjs <fr|en> <dossier> <image> [<image> ...]
import path from 'path';
import { fileURLToPath } from 'url';
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';

const ICI = path.dirname(fileURLToPath(import.meta.url));
const [lang, dossier, ...images] = process.argv.slice(2);
const EDGE = 'C:/Program Files/Google/Chrome/Application/chrome.exe'; // Chrome (Edge ne demarre plus en headless)
const serveUrl = await bundle({ entryPoint: path.join(ICI, '..', 'src', 'index.ts') });
const inputProps = { lang, bgm: true };
const composition = await selectComposition({ serveUrl, id: 'ApplyFilm', inputProps, browserExecutable: EDGE });
for (const n of images.map(Number)) {
  const sortie = path.resolve(dossier, `c${String(n).padStart(4, '0')}.png`);
  await renderStill({ composition, serveUrl, frame: n, output: sortie, inputProps, browserExecutable: EDGE, chromiumOptions: { gl: 'angle' } });
  console.log('image', n, '->', sortie);
}
