// Legal pages in English. {key} = value from src/legal/config.js ; [[page|text]] = internal link.
export default {
  majLabel: 'Last updated: {date}',
  aCompleter: 'Publisher details must be completed in src/legal/config.js before opening to the public. Have these texts reviewed by a lawyer as well.',
  titres: {
    cgu: 'Terms of Service',
    confidentialite: 'Privacy Policy',
    remboursement: 'Refunds and cancellation',
    mentions: 'Legal notice',
  },
  docs: {
    cgu: {
      intro: 'These terms govern your use of {produit}, an online service published by {editeur}. By creating an account, you accept them.',
      sections: [
        {
          titre: 'The service',
          paragraphes: [
            '{produit} helps you prepare job applications: you import your CV, add a job offer, and the service analyses how well you match, then writes a CV and a cover letter tailored to that offer, which you can download as PDF files.',
            'The service relies on artificial intelligence models provided by specialised providers (see the [[confidentialite|Privacy Policy]]).',
          ],
        },
        {
          titre: 'Your account',
          liste: [
            'The service is only available to people aged 16 or over.',
            'The information in your account must be accurate. You can correct it at any time from the [[compte|Account page]].',
            'You are responsible for keeping your password confidential and for the activity on your account. Tell us at {email} if your account is used without your permission.',
            'You must confirm your email address to use the artificial intelligence features.',
          ],
        },
        {
          titre: 'Generated documents',
          paragraphes: [
            'CVs and letters are written automatically from your profile and your answers. They may contain errors or imprecise wording: review and correct them before sending them.',
            'You remain solely responsible for the applications you send and for the accuracy of the information they contain. The match score is an indicative estimate. {produit} does not guarantee that you will get an interview or a job.',
          ],
        },
        {
          titre: 'Your content',
          paragraphes: [
            'You keep ownership of your CV, your information and the documents generated for you. You allow us to process them only to provide the service: analysis, generation, storage and export.',
            'You confirm that you have the right to use the content you import. Do not import another person’s CV without their consent.',
          ],
        },
        {
          titre: 'Prohibited uses',
          liste: [
            'Producing misleading documents: fake degrees, fake experience or fake references.',
            'Getting around plan limits, for example by creating several accounts.',
            'Extracting the service or its content automatically, or attempting to compromise its security.',
            'Using the service for unlawful content or content that infringes the rights of others.',
          ],
        },
        {
          titre: 'Plans, prices and payment',
          liste: [
            'The Free plan gives access to the service with monthly limits (applications generated, job offers analysed, CVs imported).',
            'The Pro plan raises these limits. You get it through a monthly card subscription, renewed automatically until you cancel, or a Mobile Money pass for a fixed period, with no automatic renewal.',
            'Prices are those shown on the [[tarifs|Pricing page]] at the time of purchase. A price increase never applies to a period you have already paid for.',
            'Payments are processed by Stripe (cards) and Flutterwave (Mobile Money). We never have access to your card or Mobile Money numbers.',
            'Limits reset on the 1st of each month. Unused credits do not carry over.',
          ],
        },
        {
          titre: 'Cancellation and refunds',
          paragraphes: [
            'You can cancel your subscription at any time from the [[abonnement|Subscription page]]. Your Pro plan stays active until the end of the period you have paid for. Refund conditions are set out in the [[remboursement|refund policy]].',
          ],
        },
        {
          titre: 'Availability and changes to the service',
          paragraphes: [
            'We do our best to keep the service available at all times, but cannot guarantee it: interruptions may occur for maintenance or if a provider fails.',
            'The service and plan limits may change. We will tell you in advance about any significant change that affects you.',
          ],
        },
        {
          titre: 'Liability',
          paragraphes: [
            'To the extent permitted by law, the liability of {editeur} is limited to the amount you paid in the last 12 months. We are not responsible for recruiters’ decisions or for how you use the generated documents.',
            'Nothing in these terms limits the rights that consumer protection law gives you.',
          ],
        },
        {
          titre: 'Account suspension and deletion',
          paragraphes: [
            'We may suspend an account that breaches these terms, after informing you unless there is an emergency or a legal obligation.',
            'You can delete your account at any time from the [[compte|Account page]]. Your data is then erased as described in the [[confidentialite|Privacy Policy]].',
          ],
        },
        {
          titre: 'Changes to these terms',
          paragraphes: [
            'We may change these terms. If a change is significant, we will tell you by email or in the app before it takes effect. The date of the last update is shown at the top of this page.',
          ],
        },
        {
          titre: 'Governing law and disputes',
          paragraphes: [
            'These terms are governed by the law of {pays}, without prejudice to the mandatory consumer protection rules of the country where consumers live.',
            'If you disagree with us, please write to {email} first: we will look for an amicable solution.',
          ],
        },
      ],
    },

    confidentialite: {
      intro: 'This policy explains what data {produit} processes, why, who it is shared with and how to exercise your rights. It takes into account the General Data Protection Regulation (GDPR) for people located in the European Union.',
      sections: [
        {
          titre: 'Data controller',
          paragraphes: ['{editeur}, {adresse}. Contact for any question about your data: {email}.'],
        },
        {
          titre: 'Data we process',
          liste: [
            'Account: first name, last name, email, password (stored only in irreversibly encrypted form), language, sign-up and last sign-in dates, date you accepted the terms, and your Google identifier if you use “Continue with Google”.',
            'Profile and CV: contact details, experience, education, skills and languages extracted from your CV or entered by you. The imported PDF file is not kept: it is read and then deleted immediately.',
            'Job offers and applications: text and link of the offers, analyses, answers to questions, generated CVs and letters.',
            'Subscription and payments: plan, dates, amounts, currency and payment references. Your card or Mobile Money numbers are entered at Stripe or Flutterwave: we never have access to them.',
            'Usage: number of applications generated, job offers analysed and CVs imported each month.',
            'Technical data: IP address, used to prevent abuse, and technical logs from our hosting providers.',
          ],
          paragraphes: [
            'Do not add sensitive data to your CV (health, opinions, religion, identity document number…): the service does not need it.',
          ],
        },
        {
          titre: 'Why we process it',
          liste: [
            'To provide the service (account, job offer analysis, generation and export of documents): performance of our contract with you.',
            'To manage payments, invoicing and accounting: performance of the contract and legal obligations.',
            'To keep the service secure and prevent abuse (email confirmation, usage limits): our legitimate interest in protecting the service and its users.',
            'To send you account emails (confirmation, password, security): performance of the contract. We do not send you marketing emails without your consent.',
          ],
        },
        {
          titre: 'Artificial intelligence',
          paragraphes: [
            'To analyse a job offer and write your documents, the text of your profile, the offer and your answers is sent to an AI model provider: Google, Groq, OpenRouter, Mistral AI or Anthropic, depending on availability.',
            'This data is used only to produce the result you asked for. We use offerings in which it is not used to train these providers’ models.',
            'No decision with legal effects on you is made automatically: the match score is an indication for you alone.',
          ],
        },
        {
          titre: 'Who receives your data',
          paragraphes: ['Your data is never sold or rented. It is only entrusted to the providers the service needs, who act on our instructions:'],
          liste: [
            'Hosting: Render (API), Neon (database), Vercel (website).',
            'Artificial intelligence: the providers listed above.',
            'Emails: Brevo.',
            'Payments: Stripe (cards) and Flutterwave (Mobile Money).',
            'Sign-in: Google, only if you choose “Continue with Google”.',
          ],
        },
        {
          titre: 'Transfers outside the European Union',
          paragraphes: [
            'Some providers are located outside the European Union, notably in the United States. These transfers are covered by the European Commission’s standard contractual clauses, or by the EU–US Data Privacy Framework when the provider is certified under it.',
          ],
        },
        {
          titre: 'How long we keep data',
          liste: [
            'Account, profile, job offers and applications: as long as your account exists.',
            'After your account is deleted: immediate erasure from our database. Backup copies are erased at the latest when their retention period at our database host expires.',
            'Payments: 10 years, for accounting obligations, no longer linked to your identity once the account is deleted.',
            'Email confirmation and password reset links: 48 hours and 1 hour.',
            'Imported CV file: deleted immediately after it is read.',
            'Technical logs: for the period set by our hosting providers.',
          ],
        },
        {
          titre: 'Your rights',
          paragraphes: [
            'You have the right to access, rectify, erase and port your data, and to restrict or object to its processing. In France, you can also set instructions for what happens to it after your death.',
            'From the [[compte|Account page]], you can correct your information, download all your data and delete your account yourself. For any other request, write to {email}: we reply within one month.',
            'You can also lodge a complaint with the data protection authority of your country, for example the CNIL in France.',
          ],
        },
        {
          titre: 'Security',
          paragraphes: [
            'Traffic is encrypted (HTTPS), passwords are stored in irreversibly encrypted form and access to data is restricted. As no system is infallible, we will inform you and the competent authorities of any data breach that puts you at risk, as the law requires.',
          ],
        },
        {
          titre: 'Cookies and local storage',
          paragraphes: [
            '{produit} uses no advertising cookies and no audience measurement tool. Your browser stores your sign-in session and your language choice locally: this storage is necessary for the service to work.',
            'The Stripe and Flutterwave payment pages, and the “Continue with Google” button, set their own cookies, governed by their own policies.',
          ],
        },
        {
          titre: 'Changes',
          paragraphes: [
            'We may update this policy. The date of the last update is shown at the top of this page, and we will tell you about any significant change.',
          ],
        },
      ],
    },

    remboursement: {
      intro: 'This page explains how to stop a subscription and when a payment is refunded.',
      sections: [
        {
          titre: 'Cancelling a card subscription',
          paragraphes: [
            'From the [[abonnement|Subscription page]], “Manage card and invoices” button, you can cancel at any time. The subscription is no longer renewed and your Pro plan stays active until the end of the period you have already paid for.',
          ],
        },
        {
          titre: 'Mobile Money pass',
          paragraphes: [
            'A Mobile Money pass gives you the Pro plan for the period shown at purchase. It is not renewed automatically: there is nothing to cancel.',
          ],
        },
        {
          titre: 'Refund of your first payment within 14 days',
          paragraphes: [
            'If the service does not suit you, you can ask for a refund of your first payment (first month of subscription or first pass) within 14 days, without giving a reason. Write to {email} from your account’s email address.',
            'The refund goes back to the payment method you used, and your Pro plan ends on that date.',
          ],
        },
        {
          titre: 'Renewals',
          paragraphes: [
            'Monthly renewals that have already been charged are not refunded, except in case of a billing error or a legal obligation. To avoid a renewal, cancel before the date shown on the [[abonnement|Subscription page]].',
          ],
        },
        {
          titre: 'Billing error or double payment',
          paragraphes: ['A payment charged by mistake or twice is refunded in full on request to {email}.'],
        },
        {
          titre: 'Deleting your account',
          paragraphes: [
            'Deleting your account stops your card subscription immediately, but does not trigger an automatic refund. If you are within the 14-day period, ask for your refund before deleting your account.',
          ],
        },
        {
          titre: 'Timing',
          paragraphes: ['Once granted, a refund appears within a few business days, depending on your bank or Mobile Money operator.'],
        },
        {
          titre: 'Your legal rights',
          paragraphes: ['These rules add to the rights that the law of your country gives you, and never reduce them.'],
        },
      ],
    },

    mentions: {
      intro: 'Legal information about the publisher and hosting of the {produit} website.',
      sections: [
        {
          titre: 'Publisher',
          liste: ['{editeur}', '{formeJuridique}', 'Registered office: {adresse}', 'Registration: {immatriculation}', 'Contact: {email}'],
        },
        { titre: 'Publication director', paragraphes: ['{directeur}'] },
        { titre: 'Hosting', hebergeurs: true },
        {
          titre: 'Intellectual property',
          paragraphes: [
            'The website, the {produit} brand, the code and the content of the site belong to {editeur}, except for content provided by users. Any reproduction without permission is prohibited.',
          ],
        },
        {
          titre: 'Personal data',
          paragraphes: ['How your data is processed is described in the [[confidentialite|Privacy Policy]].'],
        },
      ],
    },
  },
}
