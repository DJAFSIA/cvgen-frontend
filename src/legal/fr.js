// Pages legales en francais. {cle} = valeur de src/legal/config.js ; [[page|texte]] = lien interne.
export default {
  majLabel: 'Dernière mise à jour : {date}',
  aCompleter: 'Identité de l’éditeur à compléter dans src/legal/config.js avant l’ouverture au public. Faites aussi relire ces textes par un juriste.',
  titres: {
    cgu: 'Conditions d’utilisation',
    confidentialite: 'Politique de confidentialité',
    remboursement: 'Remboursement et résiliation',
    mentions: 'Mentions légales',
  },
  docs: {
    cgu: {
      intro: 'Ces conditions encadrent l’utilisation de {produit}, service en ligne édité par {editeur}. En créant un compte, vous les acceptez.',
      sections: [
        {
          titre: 'Le service',
          paragraphes: [
            '{produit} vous aide à préparer vos candidatures : vous importez votre CV, vous ajoutez une offre d’emploi, puis le service analyse la compatibilité et rédige un CV et une lettre de motivation adaptés à cette offre, téléchargeables en PDF.',
            'Le service s’appuie sur des modèles d’intelligence artificielle fournis par des prestataires spécialisés (voir la [[confidentialite|politique de confidentialité]]).',
          ],
        },
        {
          titre: 'Votre compte',
          liste: [
            'Le service est réservé aux personnes âgées d’au moins 16 ans.',
            'Les informations de votre compte doivent être exactes. Vous pouvez les corriger à tout moment depuis la [[compte|page Compte]].',
            'Vous êtes responsable de la confidentialité de votre mot de passe et de l’activité de votre compte. Prévenez-nous à {email} en cas d’usage non autorisé.',
            'La confirmation de votre adresse email est nécessaire pour utiliser les fonctions d’intelligence artificielle.',
          ],
        },
        {
          titre: 'Les documents générés',
          paragraphes: [
            'Les CV et lettres sont rédigés automatiquement à partir de votre profil et de vos réponses. Ils peuvent contenir des erreurs ou des formulations imprécises : relisez-les et corrigez-les avant de les envoyer.',
            'Vous restez seul responsable des candidatures que vous envoyez et de l’exactitude des informations qu’elles contiennent. Le score de compatibilité est une estimation indicative. {produit} ne garantit ni l’obtention d’un entretien ni celle d’un emploi.',
          ],
        },
        {
          titre: 'Vos contenus',
          paragraphes: [
            'Vous restez propriétaire de votre CV, de vos informations et des documents générés pour vous. Vous nous autorisez à les traiter uniquement pour fournir le service : analyse, génération, conservation et export.',
            'Vous garantissez avoir le droit d’utiliser les contenus que vous importez. N’importez pas le CV d’une autre personne sans son accord.',
          ],
        },
        {
          titre: 'Usages interdits',
          liste: [
            'Produire des documents trompeurs : faux diplômes, fausses expériences ou fausses références.',
            'Contourner les limites des plans, par exemple en créant plusieurs comptes.',
            'Extraire le service ou ses contenus de façon automatisée, ou tenter d’en compromettre la sécurité.',
            'Utiliser le service pour un contenu illicite ou portant atteinte aux droits d’autrui.',
          ],
        },
        {
          titre: 'Plans, prix et paiement',
          liste: [
            'Le plan Gratuit donne accès au service avec des limites mensuelles (candidatures générées, offres analysées, CV importés).',
            'Le plan Pro relève ces limites. Il s’obtient par un abonnement mensuel par carte, renouvelé automatiquement jusqu’à résiliation, ou par un pass Mobile Money d’une durée fixe, sans renouvellement automatique.',
            'Les prix sont ceux affichés sur la [[tarifs|page Tarifs]] au moment de l’achat. Une hausse de prix ne s’applique jamais à une période déjà payée.',
            'Les paiements sont traités par Stripe (cartes) et Flutterwave (Mobile Money). Nous n’avons jamais accès à vos numéros de carte ou de Mobile Money.',
            'Les limites se réinitialisent le 1er de chaque mois. Les crédits non utilisés ne sont pas reportés.',
          ],
        },
        {
          titre: 'Résiliation et remboursement',
          paragraphes: [
            'Vous pouvez résilier votre abonnement à tout moment depuis la [[abonnement|page Abonnement]]. Le plan Pro reste actif jusqu’à la fin de la période payée. Les conditions de remboursement sont détaillées dans la [[remboursement|politique de remboursement]].',
          ],
        },
        {
          titre: 'Disponibilité et évolution du service',
          paragraphes: [
            'Nous faisons notre possible pour que le service soit disponible en permanence, sans pouvoir le garantir : des interruptions peuvent survenir pour maintenance ou en cas de panne d’un prestataire.',
            'Le service et les limites des plans peuvent évoluer. Nous vous prévenons à l’avance de tout changement important qui vous concerne.',
          ],
        },
        {
          titre: 'Responsabilité',
          paragraphes: [
            'Dans les limites autorisées par la loi, la responsabilité de {editeur} est limitée au montant que vous avez payé au cours des 12 derniers mois. Nous ne sommes pas responsables des décisions des recruteurs, ni de l’usage que vous faites des documents générés.',
            'Rien dans ces conditions ne limite les droits que vous accorde la loi applicable aux consommateurs.',
          ],
        },
        {
          titre: 'Suspension et suppression du compte',
          paragraphes: [
            'Nous pouvons suspendre un compte qui ne respecte pas ces conditions, après vous en avoir informé sauf urgence ou obligation légale.',
            'Vous pouvez supprimer votre compte à tout moment depuis la [[compte|page Compte]]. Vos données sont alors effacées comme décrit dans la [[confidentialite|politique de confidentialité]].',
          ],
        },
        {
          titre: 'Modification de ces conditions',
          paragraphes: [
            'Nous pouvons modifier ces conditions. En cas de changement important, nous vous prévenons par email ou dans l’application avant son entrée en vigueur. La date de dernière mise à jour figure en haut de cette page.',
          ],
        },
        {
          titre: 'Droit applicable et litiges',
          paragraphes: [
            'Ces conditions sont soumises au droit de {pays}, sans préjudice des dispositions protectrices de la loi du pays de résidence des consommateurs.',
            'En cas de désaccord, écrivez-nous d’abord à {email} : nous chercherons une solution amiable.',
          ],
        },
      ],
    },

    confidentialite: {
      intro: 'Cette politique explique quelles données {produit} traite, pour quelles raisons, avec qui elles sont partagées et comment exercer vos droits. Elle tient compte du Règlement général sur la protection des données (RGPD) pour les personnes situées dans l’Union européenne.',
      sections: [
        {
          titre: 'Responsable du traitement',
          paragraphes: ['{editeur}, {adresse}. Contact pour toute question sur vos données : {email}.'],
        },
        {
          titre: 'Données que nous traitons',
          liste: [
            'Compte : prénom, nom, email, mot de passe (conservé uniquement sous forme chiffrée irréversible), langue, dates d’inscription et de dernière connexion, date d’acceptation des conditions, identifiant Google si vous utilisez « Continuer avec Google ».',
            'Profil et CV : coordonnées, expériences, formations, compétences et langues extraites de votre CV ou saisies par vous. Le fichier PDF importé n’est pas conservé : il est lu puis supprimé immédiatement.',
            'Offres et candidatures : texte et lien des offres, analyses, réponses aux questions, CV et lettres générés.',
            'Abonnement et paiements : plan, dates, montants, devise et références de paiement. Vos numéros de carte ou de Mobile Money sont saisis chez Stripe ou Flutterwave : nous n’y avons jamais accès.',
            'Consommation : nombre de candidatures générées, d’offres analysées et de CV importés chaque mois.',
            'Données techniques : adresse IP, utilisée pour limiter les abus, et journaux techniques de nos hébergeurs.',
          ],
          paragraphes: [
            'N’ajoutez pas à votre CV de données sensibles (santé, opinions, religion, numéro de pièce d’identité…) : elles ne sont pas utiles au service.',
          ],
        },
        {
          titre: 'Pourquoi nous les traitons',
          liste: [
            'Fournir le service (compte, analyse des offres, génération et export des documents) : exécution du contrat qui nous lie.',
            'Gérer les paiements, la facturation et la comptabilité : exécution du contrat et obligations légales.',
            'Assurer la sécurité et prévenir les abus (confirmation d’email, limites d’utilisation) : notre intérêt légitime à protéger le service et ses utilisateurs.',
            'Vous envoyer les emails liés à votre compte (confirmation, mot de passe, sécurité) : exécution du contrat. Nous ne vous envoyons pas d’emails publicitaires sans votre accord.',
          ],
        },
        {
          titre: 'Intelligence artificielle',
          paragraphes: [
            'Pour analyser une offre et rédiger vos documents, le texte de votre profil, de l’offre et de vos réponses est transmis à un fournisseur de modèles d’IA : Google, Groq, OpenRouter, Mistral AI ou Anthropic, selon leur disponibilité.',
            'Ces données servent uniquement à produire le résultat demandé. Nous utilisons des offres dans lesquelles elles ne servent pas à entraîner les modèles de ces fournisseurs.',
            'Aucune décision produisant des effets juridiques à votre égard n’est prise de façon automatisée : le score de compatibilité est une indication destinée à vous seul.',
          ],
        },
        {
          titre: 'Qui reçoit vos données',
          paragraphes: ['Vos données ne sont ni vendues ni louées. Elles sont confiées uniquement aux prestataires nécessaires au service, qui agissent selon nos instructions :'],
          liste: [
            'Hébergement : Render (API), Neon (base de données), Vercel (site web).',
            'Intelligence artificielle : les fournisseurs cités ci-dessus.',
            'Emails : Brevo.',
            'Paiements : Stripe (cartes) et Flutterwave (Mobile Money).',
            'Connexion : Google, uniquement si vous choisissez « Continuer avec Google ».',
          ],
        },
        {
          titre: 'Transferts hors de l’Union européenne',
          paragraphes: [
            'Certains prestataires sont situés hors de l’Union européenne, notamment aux États-Unis. Ces transferts sont encadrés par les clauses contractuelles types de la Commission européenne, ou par le cadre de protection des données UE–États-Unis lorsque le prestataire y est certifié.',
          ],
        },
        {
          titre: 'Durées de conservation',
          liste: [
            'Compte, profil, offres et candidatures : tant que votre compte existe.',
            'Après la suppression du compte : effacement immédiat de notre base de données. Les copies de sauvegarde sont effacées au plus tard à l’expiration de leur durée de rétention chez notre hébergeur de base de données.',
            'Paiements : 10 ans, au titre des obligations comptables, sans lien avec votre identité une fois le compte supprimé.',
            'Liens de confirmation d’email et de réinitialisation du mot de passe : 48 heures et 1 heure.',
            'Fichier CV importé : supprimé immédiatement après sa lecture.',
            'Journaux techniques : selon la durée fixée par nos hébergeurs.',
          ],
        },
        {
          titre: 'Vos droits',
          paragraphes: [
            'Vous disposez d’un droit d’accès, de rectification, d’effacement, de portabilité, de limitation et d’opposition sur vos données. En France, vous pouvez aussi définir des directives sur leur sort après votre décès.',
            'Depuis la [[compte|page Compte]], vous pouvez corriger vos informations, télécharger toutes vos données et supprimer votre compte vous-même. Pour toute autre demande, écrivez à {email} : nous répondons dans un délai d’un mois.',
            'Vous pouvez aussi adresser une réclamation à l’autorité de protection des données de votre pays, par exemple la CNIL en France.',
          ],
        },
        {
          titre: 'Sécurité',
          paragraphes: [
            'Les échanges sont chiffrés (HTTPS), les mots de passe sont conservés sous forme chiffrée irréversible et l’accès aux données est limité. Aucun système n’étant infaillible, nous vous informerons, ainsi que les autorités compétentes, en cas de violation de données présentant un risque pour vous, comme la loi l’exige.',
          ],
        },
        {
          titre: 'Cookies et stockage local',
          paragraphes: [
            '{produit} n’utilise ni cookies publicitaires ni outil de mesure d’audience. Votre navigateur conserve localement votre session de connexion et votre choix de langue : ce stockage est nécessaire au fonctionnement du service.',
            'Les pages de paiement de Stripe et de Flutterwave, ainsi que le bouton « Continuer avec Google », déposent leurs propres cookies, régis par leurs politiques respectives.',
          ],
        },
        {
          titre: 'Modifications',
          paragraphes: [
            'Nous pouvons mettre à jour cette politique. La date de dernière mise à jour figure en haut de cette page, et nous vous prévenons de tout changement important.',
          ],
        },
      ],
    },

    remboursement: {
      intro: 'Cette page explique comment arrêter un abonnement et dans quels cas un paiement est remboursé.',
      sections: [
        {
          titre: 'Résilier un abonnement par carte',
          paragraphes: [
            'Depuis la [[abonnement|page Abonnement]], bouton « Gérer la carte et les factures », vous pouvez résilier à tout moment. L’abonnement n’est plus renouvelé et le plan Pro reste actif jusqu’à la fin de la période déjà payée.',
          ],
        },
        {
          titre: 'Pass Mobile Money',
          paragraphes: [
            'Un pass Mobile Money donne accès au plan Pro pendant la durée indiquée lors de l’achat. Il n’est pas renouvelé automatiquement : il n’y a rien à résilier.',
          ],
        },
        {
          titre: 'Remboursement du premier paiement sous 14 jours',
          paragraphes: [
            'Si le service ne vous convient pas, vous pouvez demander le remboursement de votre premier paiement (premier mois d’abonnement ou premier pass) dans les 14 jours qui suivent, sans avoir à vous justifier. Écrivez à {email} depuis l’adresse de votre compte.',
            'Le remboursement est fait sur le moyen de paiement utilisé, et le plan Pro prend fin à cette date.',
          ],
        },
        {
          titre: 'Renouvellements',
          paragraphes: [
            'Les renouvellements mensuels déjà prélevés ne sont pas remboursés, sauf erreur de facturation ou obligation légale. Pour éviter un renouvellement, résiliez avant la date indiquée sur la [[abonnement|page Abonnement]].',
          ],
        },
        {
          titre: 'Erreur ou double paiement',
          paragraphes: ['Un paiement débité par erreur ou en double est intégralement remboursé sur simple demande à {email}.'],
        },
        {
          titre: 'Suppression du compte',
          paragraphes: [
            'Supprimer votre compte arrête immédiatement l’abonnement par carte, mais n’entraîne pas de remboursement automatique. Si vous êtes dans le délai de 14 jours, demandez le remboursement avant de supprimer votre compte.',
          ],
        },
        {
          titre: 'Délais',
          paragraphes: ['Une fois accordé, un remboursement apparaît sous quelques jours ouvrés, selon votre banque ou votre opérateur Mobile Money.'],
        },
        {
          titre: 'Vos droits légaux',
          paragraphes: ['Ces règles s’ajoutent aux droits que vous accorde la loi de votre pays, sans jamais les réduire.'],
        },
      ],
    },

    mentions: {
      intro: 'Informations légales sur l’éditeur et l’hébergement du site {produit}.',
      sections: [
        {
          titre: 'Éditeur',
          liste: ['{editeur}', '{formeJuridique}', 'Siège : {adresse}', 'Immatriculation : {immatriculation}', 'Contact : {email}'],
        },
        { titre: 'Directeur de la publication', paragraphes: ['{directeur}'] },
        { titre: 'Hébergement', hebergeurs: true },
        {
          titre: 'Propriété intellectuelle',
          paragraphes: [
            'Le site, la marque {produit}, le code et les contenus du site appartiennent à {editeur}, à l’exception des contenus fournis par les utilisateurs. Toute reproduction sans autorisation est interdite.',
          ],
        },
        {
          titre: 'Données personnelles',
          paragraphes: ['Le traitement de vos données est décrit dans la [[confidentialite|politique de confidentialité]].'],
        },
      ],
    },
  },
}
