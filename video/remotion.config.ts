import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer('angle');
// Chrome installe sert de navigateur de rendu (le telechargement de Chrome Headless Shell echoue ici ;
// Edge, mis a jour le 18/11/2026, ne demarre plus en mode headless)
Config.setBrowserExecutable('C:/Program Files/Google/Chrome/Application/chrome.exe');
// Peu de memoire libre sur ce PC : deux images en parallele seulement
Config.setConcurrency(2);
// Qualite pour du texte d'interface (revue v3) : images intermediaires JPEG a 95, CRF 16, couleurs
// etiquetees BT.709 (au lieu de BT.601 plage complete non etiquetee)
Config.setJpegQuality(95);
Config.setCrf(16);
Config.setColorSpace('bt709');
