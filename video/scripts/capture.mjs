// Capture des vrais ecrans d'Apply pour le film : pages entieres en 2x, positions des elements
// (layout.<lang>.json) et PDF reels. Necessite l'API (8001) et le site (5174) lances en local,
// et les comptes fictifs crees par demo_accounts.py (fichier scripts/.demo.json).
// Usage : node scripts/capture.mjs [fr] [en]
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer-core';
import { MOTS_CLES, OFFRE, PROFIL, REPONSES } from './donnees.mjs';

const ICI = path.dirname(fileURLToPath(import.meta.url));
const RACINE = path.join(ICI, '..');
const EDGE = 'C:/Program Files/Google/Chrome/Application/chrome.exe'; // Chrome (Edge ne demarre plus en headless)
const SITE = 'http://localhost:5174';
const API = 'http://127.0.0.1:8001';
const demo = JSON.parse(fs.readFileSync(path.join(ICI, '.demo.json'), 'utf8'));
const LANGS = process.argv.slice(2).length ? process.argv.slice(2) : ['fr', 'en'];
const pause = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(chemin, { methode = 'GET', jeton, corps, brut = false } = {}) {
  const r = await fetch(`${API}${chemin}`, {
    method: methode,
    headers: { 'Content-Type': 'application/json', ...(jeton ? { Authorization: `Bearer ${jeton}` } : {}) },
    body: corps ? JSON.stringify(corps) : undefined,
  });
  if (!r.ok) throw new Error(`${methode} ${chemin} : ${r.status} ${(await r.text()).slice(0, 200)}`);
  return brut ? Buffer.from(await r.arrayBuffer()) : r.json();
}

// Rectangle d'un element en coordonnees de page (CSS px)
const RECT = `(el) => { const r = el.getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height }; }`;

async function attendre(page, fonction, delai = 240000) {
  await page.waitForFunction(fonction, { timeout: delai, polling: 250 });
}

async function pleinePage(page, sortie, nom) {
  await page.evaluate(() => { document.documentElement.style.scrollBehavior = 'auto'; window.scrollTo(0, 0); });
  await page.evaluate(() => document.fonts.ready);
  await pause(900);
  const pageH = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.screenshot({ path: path.join(sortie, `${nom}.png`), fullPage: true });
  console.log('  capture', nom, pageH);
  return pageH;
}

for (const lang of LANGS) {
  console.log('==', lang);
  const sortie = path.join(RACINE, 'public', 'textures', lang);
  fs.mkdirSync(sortie, { recursive: true });
  const layout = {};
  const { access_token: jeton, utilisateur } = await api('/auth/login', {
    methode: 'POST', corps: { email: demo.emails[lang], mot_de_passe: demo.mdp },
  });
  await api('/profil/', { methode: 'PUT', jeton, corps: Object.fromEntries(Object.keys(PROFIL[lang]).map((k) => [k, null])) });

  const browser = await puppeteer.launch({ executablePath: EDGE, headless: true, args: ['--no-first-run', '--hide-scrollbars'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
  await page.evaluateOnNewDocument((t, u, l) => {
    localStorage.setItem('token', t);
    localStorage.setItem('user', u);
    localStorage.setItem('lang', l);
  }, jeton, JSON.stringify(utilisateur), lang);
  page.on('pageerror', (e) => console.log('  ERREUR PAGE', e.message.slice(0, 160)));
  const aller = async (url, attente = 1200) => {
    await page.goto(`${SITE}${url}`, { waitUntil: 'networkidle0', timeout: 60000 });
    await pause(attente);
  };

  // ---- 1. Profil vide puis rempli (meme mise en page : les champs se superposent exactement)
  await aller('/profil');
  await attendre(page, () => document.querySelector('#titre_profil'));
  const champs = () => page.evaluate(`[...document.querySelectorAll('main label')].map((l) => ({ cle: l.htmlFor, ...(${RECT})(l.parentElement) }))`);
  const hVide = await pleinePage(page, sortie, 'profil-vide');
  const champsVides = await champs();
  await api('/profil/', { methode: 'PUT', jeton, corps: PROFIL[lang] });
  await aller('/profil');
  await attendre(page, () => document.querySelector('#titre_profil')?.value);
  const hPlein = await pleinePage(page, sortie, 'profil-plein');
  layout.profil = {
    pageH: hPlein,
    pageHVide: hVide,
    champs: await champs(),
    champsVides,
    importCarte: await page.evaluate(`(${RECT})([...document.querySelectorAll('main button')].find((b) => b.closest('.shadow-card')).closest('.shadow-card'))`),
    cartes: await page.evaluate(`[...document.querySelectorAll('main .shadow-card')].map(${RECT})`),
    bouton: await page.evaluate(`(${RECT})([...document.querySelectorAll('main button')].at(-1))`),
  };

  // ---- 2. Offre collee : texte entier visible, position de chaque mot cle
  await aller('/nouvelle-candidature', 800);
  await page.evaluate((texte) => {
    const ta = document.querySelector('#contenu');
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set.call(ta, texte);
    ta.dispatchEvent(new Event('input', { bubbles: true }));
  }, OFFRE[lang]);
  await pause(300);
  await page.evaluate(() => { const ta = document.querySelector('#contenu'); ta.style.height = `${ta.scrollHeight + 4}px`; });
  const hOffre = await pleinePage(page, sortie, 'offre');
  const mots = await page.evaluate((motsCles) => {
    const ta = document.querySelector('#contenu');
    const cs = getComputedStyle(ta);
    const r = ta.getBoundingClientRect();
    const miroir = document.createElement('div');
    for (const p of ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'wordSpacing', 'paddingTop', 'paddingRight',
      'paddingBottom', 'paddingLeft', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'boxSizing', 'tabSize']) {
      miroir.style[p] = cs[p];
    }
    Object.assign(miroir.style, {
      position: 'absolute', left: `${r.left + scrollX}px`, top: `${r.top + scrollY}px`, width: `${r.width}px`,
      whiteSpace: 'pre-wrap', overflowWrap: 'break-word', borderStyle: 'solid', borderColor: 'transparent', visibility: 'hidden',
    });
    const texte = ta.value;
    let pos = 0;
    const morceaux = [];
    motsCles.forEach(([mot], i) => {
      const at = texte.indexOf(mot, pos);
      if (at < 0) throw new Error(`mot cle introuvable : ${mot}`);
      morceaux.push(document.createTextNode(texte.slice(pos, at)));
      const s = document.createElement('span');
      s.id = `mot-${i}`;
      s.textContent = mot;
      morceaux.push(s);
      pos = at + mot.length;
    });
    morceaux.push(document.createTextNode(texte.slice(pos)));
    morceaux.forEach((n) => miroir.appendChild(n));
    document.body.appendChild(miroir);
    const res = motsCles.map(([mot, label], i) => {
      const b = miroir.querySelector(`#mot-${i}`).getBoundingClientRect();
      return { mot, label, x: b.left + scrollX, y: b.top + scrollY, w: b.width, h: b.height };
    });
    miroir.remove();
    return res;
  }, MOTS_CLES[lang]);
  layout.offre = {
    pageH: hOffre,
    zone: await page.evaluate(`(${RECT})(document.querySelector('#contenu'))`),
    carte: await page.evaluate(`(${RECT})(document.querySelector('#contenu').closest('.shadow-card'))`),
    mots,
  };

  // ---- 3. Analyse par la vraie IA, puis reponses aux questions
  await page.evaluate(() => document.querySelector('main button.w-full').click());
  await attendre(page, () => document.querySelector('[id^="q-"]') || document.querySelector('[role=alert]'));
  const erreur = await page.evaluate(() => document.querySelector('[role=alert]')?.innerText);
  if (erreur) throw new Error(`analyse refusee : ${erreur}`);
  await pause(1500);
  const questions = await page.evaluate(() => [...document.querySelectorAll('[id^="q-"]')].map((t) => ({
    id: t.id, texte: t.closest('div').parentElement.innerText.toLowerCase(),
  })));
  for (const q of questions) {
    const reponse = REPONSES[lang].find(([motif]) => motif.test(q.texte))[1];
    await page.type(`#${q.id}`, reponse, { delay: 0 });
  }
  await page.evaluate(() => document.activeElement?.blur());
  const hAnalyse = await pleinePage(page, sortie, 'analyse');
  layout.analyse = await page.evaluate(`(() => {
    const R = ${RECT};
    const anneau = document.querySelector('main svg.-rotate-90');
    const carteScore = anneau.closest('.shadow-card');
    const affiner = document.querySelector('main h2').closest('.shadow-card');
    const blocs = [...document.querySelectorAll('[id^="q-"]')].map((t) => t.closest('div').parentElement);
    return {
      carteScore: R(carteScore),
      anneau: R(anneau),
      pourcent: R(anneau.parentElement.querySelector('span')),
      score: parseInt(anneau.parentElement.querySelector('span').textContent, 10),
      poste: R(carteScore.querySelector('p.font-semibold')),
      listes: [...document.querySelectorAll('main ul')].map((u) => R(u.parentElement)),
      affiner: R(affiner),
      titreAffiner: R(affiner.querySelector('h2')),
      diagnostic: R(affiner.querySelector('h2 + p')),
      questions: blocs.map(R),
      langue: R(document.querySelector('#langue-docs').closest('div').parentElement),
      modeles: R(document.querySelector('main fieldset')),
      generer: R([...document.querySelectorAll('main button.w-full')].at(-1)),
    };
  })()`);
  layout.analyse.pageH = hAnalyse;
  // Fond sans les questions ni le diagnostic : ils sont reposes un a un par le film
  await page.evaluate(() => {
    const affiner = document.querySelector('main h2').closest('.shadow-card');
    affiner.querySelector('h2 + p').style.visibility = 'hidden';
    document.querySelectorAll('[id^="q-"]').forEach((t) => { t.closest('div').parentElement.style.visibility = 'hidden'; });
  });
  await pleinePage(page, sortie, 'analyse-sans-questions');
  await page.evaluate(() => {
    const affiner = document.querySelector('main h2').closest('.shadow-card');
    affiner.querySelector('h2 + p').style.visibility = '';
    document.querySelectorAll('[id^="q-"]').forEach((t) => { t.closest('div').parentElement.style.visibility = ''; });
  });
  // Carte score en 4x pour le gros plan
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 4 });
  await pause(800);
  await (await page.$('main svg.-rotate-90')).evaluate((s) => s.closest('.shadow-card').scrollIntoView({ block: 'center' }));
  await pause(400);
  await (await page.evaluateHandle(() => document.querySelector('main svg.-rotate-90').closest('.shadow-card'))).screenshot({ path: path.join(sortie, 'score-4x.png') });
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
  await pause(800);

  // ---- 4. Generation du CV et de la lettre
  await page.evaluate(() => [...document.querySelectorAll('main button.w-full')].at(-1).click());
  await attendre(page, () => document.querySelectorAll('.doc-preview').length === 2 || document.querySelector('[role=alert]'));
  const erreur2 = await page.evaluate(() => document.querySelector('[role=alert]')?.innerText);
  if (erreur2) throw new Error(`generation refusee : ${erreur2}`);
  const hDocs = await pleinePage(page, sortie, 'documents');
  layout.documents = await page.evaluate(`(() => {
    const R = ${RECT};
    const colonnes = [...document.querySelectorAll('.doc-preview')].map((d) => d.parentElement);
    const blocs = [];
    colonnes.forEach((c, col) => {
      const vu = c.getBoundingClientRect();
      c.querySelectorAll('h1, h2, h3, h4, p, li').forEach((el) => {
        if (el.querySelector('p, li')) return;
        const r = el.getBoundingClientRect();
        if (r.height < 2 || r.top >= vu.bottom - 4 || r.bottom <= vu.top) return;
        blocs.push({ col, tag: el.tagName.toLowerCase(), ...R(el), h: Math.min(r.bottom, vu.bottom - 2) - r.top });
      });
    });
    return {
      colonnes: colonnes.map(R),
      titres: [...document.querySelectorAll('main section h3')].map(R),
      barre: R(document.querySelector('main .shadow-card')),
      blocs,
    };
  })()`);
  layout.documents.pageH = hDocs;

  // ---- 5. PDF reels de cette candidature (convertis en images par pdf_vers_png.py)
  const candidatures = await api('/candidature/', { jeton });
  const recente = candidatures.sort((a, b) => b.date_creation.localeCompare(a.date_creation))[0];
  for (const [nom, params] of [['cv-classique', 'type_doc=cv&modele=classique'], ['cv-moderne', 'type_doc=cv&modele=moderne'],
    ['cv-ats', 'type_doc=cv&modele=ats'], ['lettre', 'type_doc=lettre']]) {
    fs.writeFileSync(path.join(sortie, `${nom}.pdf`), await api(`/candidature/${recente.id}/export-pdf?${params}`, { jeton, brut: true }));
  }
  layout.score = recente.score_compatibilite;
  layout.poste = recente.titre_poste;

  // ---- 6. Accueil du site (fond du plan final)
  await page.evaluate(() => { localStorage.removeItem('token'); localStorage.removeItem('user'); });
  const accueil = await browser.newPage();
  await accueil.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
  await accueil.evaluateOnNewDocument((l) => localStorage.setItem('lang', l), lang);
  await accueil.goto(SITE, { waitUntil: 'networkidle0', timeout: 60000 });
  await pause(2600);
  await accueil.screenshot({ path: path.join(sortie, 'accueil.png') });

  fs.writeFileSync(path.join(RACINE, 'src', `layout.${lang}.json`), JSON.stringify(layout, null, 1));
  console.log('  layout ecrit,', layout.analyse.questions.length, 'questions,', layout.documents.blocs.length, 'blocs, score', layout.score);
  await browser.close();
}
