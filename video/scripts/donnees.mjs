// Donnees fictives du film, par langue : profil d'Amina Exemple, offre, mots cles a encadrer,
// reponses aux questions de l'IA (choisies selon le sujet de chaque question).

export const PROFIL = {
  fr: {
    nom_complet_cv: 'Amina Exemple',
    email_cv: 'amina.exemple@example.com',
    telephone: '+237 600 000 000',
    adresse: 'Douala, Cameroun',
    titre_profil: 'Cheffe de projet digital',
    experiences: [
      {
        poste: 'Cheffe de projet digital', entreprise: 'Agence Horizon', lieu: 'Douala', date: '2022 - aujourd’hui',
        description: [
          'Pilotage de 12 projets web et mobile par an, du cadrage à la mise en ligne, avec des équipes de 4 à 8 personnes.',
          'Suivi de budget et points hebdomadaires : retards de livraison réduits de 30 %.',
          'Coordination des prestataires et relation avec des clients de la banque et des télécoms.',
        ],
      },
      {
        poste: 'Chargée de marketing digital', entreprise: 'Boutique Sahel', lieu: 'Yaoundé', date: '2019 - 2022',
        description: [
          'Refonte du site e-commerce et lancement du paiement par Mobile Money.',
          'Campagnes Google et réseaux sociaux, 2 millions de FCFA de budget mensuel.',
        ],
      },
    ],
    formations: [
      { diplome: 'Master Management de projet', etablissement: 'Université de Douala', lieu: 'Douala', date: '2019' },
      { diplome: 'Licence Communication', etablissement: 'Université de Yaoundé II', lieu: 'Yaoundé', date: '2017' },
    ],
    competences: 'Gestion de projet, Méthodes agiles, Jira, Google Analytics, Cahier des charges, Budget, Relation client',
    langues: 'Français (langue maternelle), Anglais (professionnel)',
  },
  en: {
    nom_complet_cv: 'Amina Exemple',
    email_cv: 'amina.exemple@example.com',
    telephone: '+237 600 000 000',
    adresse: 'Douala, Cameroon',
    titre_profil: 'Digital Project Manager',
    experiences: [
      {
        poste: 'Digital Project Manager', entreprise: 'Horizon Agency', lieu: 'Douala', date: '2022 - present',
        description: [
          'Lead 12 web and mobile projects a year, from scoping to launch, with teams of 4 to 8 people.',
          'Weekly reviews and budget tracking cut delivery delays by 30%.',
          'Coordinate vendors and manage banking and telecom clients.',
        ],
      },
      {
        poste: 'Digital Marketing Officer', entreprise: 'Sahel Store', lieu: 'Yaoundé', date: '2019 - 2022',
        description: [
          'Rebuilt the e-commerce site and launched Mobile Money payments.',
          'Ran Google and social media campaigns with a monthly budget of 2 million CFA francs.',
        ],
      },
    ],
    formations: [
      { diplome: 'Master’s in Project Management', etablissement: 'University of Douala', lieu: 'Douala', date: '2019' },
      { diplome: 'Bachelor’s in Communication', etablissement: 'University of Yaoundé II', lieu: 'Yaoundé', date: '2017' },
    ],
    competences: 'Project management, Agile methods, Jira, Google Analytics, Requirements writing, Budgeting, Client relations',
    langues: 'French (native), English (professional)',
  },
};

export const OFFRE = {
  fr: `Chef de projet digital (H/F) - Société Exemple, Douala

Société Exemple, entreprise de services numériques, recherche un chef de projet digital pour piloter la refonte de ses plateformes web et mobile.

Vos missions :
- Piloter les projets du cadrage à la mise en ligne, avec des équipes de développeurs et de designers
- Rédiger les cahiers des charges et suivre les budgets
- Animer les rituels agiles et coordonner les prestataires
- Suivre les indicateurs de performance avec Google Analytics

Votre profil :
- Au moins 5 ans d'expérience en gestion de projet digital
- Maîtrise de Jira et des méthodes agiles
- Anglais professionnel
- Une expérience du paiement mobile est un plus

Contrat à durée indéterminée, basé à Douala.`,
  en: `Digital Project Manager - Example Company, Douala

Example Company, a digital services firm, is looking for a digital project manager to lead the rebuild of its web and mobile platforms.

Your role:
- Lead projects from scoping to launch with developers and designers
- Write requirements and track budgets
- Run agile ceremonies and coordinate vendors
- Track performance metrics with Google Analytics

About you:
- At least 5 years of experience in digital project management
- Strong command of Jira and agile methods
- Professional English
- Experience with mobile payments is a plus

Permanent contract, based in Douala.`,
};

// Mots cles encadres par la ligne de lecture, avec leur etiquette (dans l'ordre du texte)
export const MOTS_CLES = {
  fr: [
    ['Chef de projet digital', 'POSTE'],
    ['cahiers des charges', 'LIVRABLE'],
    ['rituels agiles', 'MÉTHODE'],
    ['Google Analytics', 'OUTIL'],
    ["5 ans d'expérience", 'EXPÉRIENCE'],
    ['Anglais professionnel', 'LANGUE'],
    ['paiement mobile', 'ATOUT'],
  ],
  en: [
    ['Digital Project Manager', 'ROLE'],
    ['Write requirements', 'DELIVERABLE'],
    ['agile ceremonies', 'METHOD'],
    ['Google Analytics', 'TOOL'],
    ['5 years of experience', 'EXPERIENCE'],
    ['Professional English', 'LANGUAGE'],
    ['mobile payments', 'BONUS'],
  ],
};

export const REPONSES = {
  fr: [
    [/mobile money|paiement/, "J'ai coordonné le prestataire et les tests du paiement par Mobile Money chez Boutique Sahel, jusqu'à sa mise en ligne en 2021."],
    [/agile|jira|rituel|sprint/, "J'anime chaque semaine les rituels agiles dans Jira avec des équipes de 4 à 8 personnes."],
    [/anglais/, "J'échange chaque semaine en anglais avec des prestataires et je rédige mes comptes rendus dans cette langue."],
    [/analytics|indicateur|donnée/, 'Je suis chaque mois les conversions dans Google Analytics et j’ajuste les priorités du projet en conséquence.'],
    [/motiv|attire|pourquoi|souhait/, 'Je souhaite travailler sur des produits numériques à fort impact au Cameroun, au plus près des utilisateurs.'],
    [/.*/, "Sur la dernière refonte d'Agence Horizon, le suivi hebdomadaire du budget a permis de livrer dans les délais."],
  ],
  en: [
    [/mobile money|payment/, 'I coordinated the vendor and the testing of Mobile Money payments at Sahel Store until launch in 2021.'],
    [/agile|jira|ceremon|sprint/, 'I run weekly agile ceremonies in Jira with teams of 4 to 8 people.'],
    [/english/, 'I work with vendors in English every week and write my reports in English.'],
    [/analytics|metric|data/, 'I review conversions in Google Analytics every month and adjust project priorities accordingly.'],
    [/motiv|attract|why|interest/, 'I want to build high-impact digital products in Cameroon, close to the people who use them.'],
    [/.*/, 'On the latest rebuild at Horizon Agency, weekly budget tracking let us deliver on time.'],
  ],
};
