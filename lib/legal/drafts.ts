import {
  LEGAL_CONTACT_EMAIL,
  LEGAL_SITE_HOST,
  type LegalCopySection,
  assertLegalSections,
} from "./published";

export const privacySections = assertLegalSections([
  {
    title: "Introduction",
    paragraphs: [
      `Jasper Fu ("we," "us," or "our"), co-founder and CEO of Coinsub, Inc., maintains this website (the "Site") as a personal and professional resource for press, media, partners, and other visitors. The Site is separate from Coinsub, Inc. and any other company, product, application, or service Jasper Fu is otherwise involved with, which are governed by their own separate terms and privacy disclosures.`,
      `This Privacy Policy explains how we collect, use, disclose, and safeguard information when you visit or interact with the Site, located at ${LEGAL_SITE_HOST}, and any associated pages that link to this policy. It applies to all visitors to the Site, including members of the press and media. It does not apply to third-party websites the Site links to.`,
      "By using the Site, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with the terms described here, please do not use the Site. We may update this Privacy Policy from time to time as described in Changes to This Privacy Policy.",
    ],
  },
  {
    title: "Information We Collect",
    blocks: [
      {
        type: "paragraph",
        text: "Because the Site is primarily an informational resource for press and media, we collect only limited information, including the following categories:",
      },
      {
        type: "paragraph",
        text: "Contact and Inquiry Information",
      },
      {
        type: "bullets",
        items: [
          "Name, email address, and any other information you choose to provide when you contact us or submit a press or media inquiry",
          "Outlet or organization name, if you identify one, and the content of your message",
          "Email address and any details you submit if you sign up for press alerts or updates (if offered)",
        ],
      },
      {
        type: "paragraph",
        text: "Embedded Content Information",
      },
      {
        type: "bullets",
        items: [
          "The Site may embed third-party content, such as video interviews (for example, YouTube) or assets hosted on third-party platforms",
          "These embeds may collect information about your interaction with them under the applicable third party's own privacy policy",
          "We do not control these third parties or their data practices",
          "Information about your interaction with embedded content is governed by the hosting platform's own privacy policy, not this one",
        ],
      },
      {
        type: "paragraph",
        text: "Automatically Collected Information",
      },
      {
        type: "bullets",
        items: [
          "IP address, browser type, device type, and operating system",
          "Referring and exit pages, pages viewed, and the dates and times of your visits",
          "Cookies and similar tracking technologies, as described in Cookies and Analytics and in our separate Cookie Policy",
        ],
      },
      {
        type: "paragraph",
        text: "Sensitive Information",
      },
      {
        type: "bullets",
        items: [
          "We do not intentionally collect government identifiers through the Site",
          "We do not intentionally collect financial account details through the Site",
          "We do not intentionally collect health information through the Site; please do not send sensitive information via the press inbox or any form",
        ],
      },
      {
        type: "paragraph",
        text: "We collect this information directly from you when you contact us, submit a press or media inquiry, or sign up for updates. We also collect certain information automatically through your use of the Site, and through third-party embeds, as described above.",
      },
    ],
  },
  {
    title: "How We Use Your Information",
    paragraphs: [
      "We use the information we collect for purposes including the following:",
    ],
    bullets: [
      "Operating, maintaining, securing, and improving the Site",
      "Responding to press, media, and partnership inquiries and communicating with you",
      "Understanding how visitors use the Site and measuring the performance of our content",
      "Sending press updates or alerts you have requested, and allowing you to opt out",
      "Supporting embedded third-party content and related Site functionality",
      "Communicating with you in response to inquiries or subscription requests",
      "Providing technical support and responding to questions about the Site",
      "Monitoring usage patterns to improve performance and the visitor experience",
      "Detecting, preventing, and addressing fraud, technical issues, or misuse of the Site",
      "Complying with applicable legal obligations and enforcing our Terms of Service",
    ],
  },
  {
    title: "Embedded Content and Third-Party Platforms",
    paragraphs: [
      "The Site may include content embedded from third-party platforms, such as video interviews, social media posts, or press coverage hosted elsewhere. When you interact with this embedded content, the third-party platform may collect information about that interaction under its own privacy policy.",
      "We do not control third-party platforms and are not responsible for their content or privacy practices. If you choose to interact with embedded content, for example by playing a video or clicking through to a linked platform, that interaction is governed by the applicable third party's terms and privacy policy, not this one.",
      "The Site may also link to third-party websites, social media profiles, and platforms. We are not responsible for the privacy practices, content, or terms of any third-party sites, even where we link to them.",
      "We do not sell your personal information, and we do not use embedded third-party content or your interactions with it for our own advertising or behavioral marketing purposes.",
      "We may use aggregated, de-identified usage data about how visitors interact with the Site's content, including embedded materials, to understand engagement and improve the Site. This aggregated data is not intended to identify any individual visitor.",
    ],
  },
  {
    title: "Third-Party Services",
    paragraphs: [
      "We rely on third-party service providers, such as hosting, analytics, email, embedded media, and form-processing providers, to operate the Site. These providers process information on our behalf under contract, or under their own policies where they act independently.",
      "Some content on the Site is hosted or delivered through third-party platforms, for example video or social media embeds. Your use of such a platform is subject to that provider's own privacy policy and terms of service, in addition to this Privacy Policy. We do not control and are not responsible for the data practices of third-party platforms.",
      "Third-party service providers are permitted to access and process information only to the extent necessary to perform services on our behalf, and, where required, are contractually obligated to protect your information and to use it only for the purposes we specify.",
    ],
  },
  {
    title: "Cookies and Analytics",
    paragraphs: [
      "We use cookies and similar tracking technologies to operate the Site, remember your preferences, and understand how the Site is used. These technologies may include session cookies, persistent cookies, and analytics scripts provided by third parties.",
      "Cookies and analytics tools help us to:",
    ],
    bullets: [
      "Operate and secure the Site, including keeping you logged in where applicable",
      "Understand which content and pages are used and how the Site performs",
      "Diagnose technical issues and improve reliability",
      "Measure the effectiveness of press updates and content, where you have consented",
    ],
    closing: [
      "You can control cookies through your browser settings, including by blocking or deleting cookies. Disabling certain cookies may affect the functionality of the Site. Full detail on the cookies we use, their purposes, and how to manage them is set out in our separate Cookie Policy.",
    ],
  },
  {
    title: "How We Share Information",
    paragraphs: [
      "Jasper Fu does not sell your personal information. We may share information in the following circumstances:",
    ],
    bullets: [
      "With service providers who perform services on our behalf, such as hosting, analytics, email, and form-processing",
      "With professional advisors, such as legal counsel, where necessary",
      "To comply with applicable law, regulation, legal process, or governmental request",
      "To enforce our Terms of Service, investigate potential violations, or protect the rights, property, or safety of Jasper Fu, Site visitors, or others",
      "To detect, prevent, or address fraud, security, or technical issues",
      "If we transfer this Site or our related professional activities to a business entity or successor, in which personal information may be transferred as part of the transaction, subject to standard confidentiality arrangements",
      "With your consent or at your direction",
    ],
  },
  {
    title: "Data Retention",
    paragraphs: [
      "We retain information only as long as necessary for the purposes described in this policy, for example, to respond to and follow up on your inquiry, maintain records, comply with legal obligations, and keep the Site secure. Retention periods vary depending on the type of information and the purpose for which it was collected.",
      "When information is no longer needed for these purposes, we will take reasonable steps to delete, de-identify, or anonymize it, unless retention is required by law. You may request deletion of your information as described in Your Privacy Rights.",
    ],
  },
  {
    title: "Data Security",
    paragraphs: [
      "We implement administrative, technical, and organizational safeguards designed to protect your information against unauthorized access, disclosure, alteration, and destruction. These measures include encryption of data in transit, access controls, and regular review of our security practices.",
      "No method of transmission or storage is completely secure. While we work to protect your information, we cannot guarantee absolute security, and you use the Site at your own risk with respect to matters outside our reasonable control. Please avoid sending sensitive information through the Site.",
    ],
  },
  {
    title: "International Data Transfers",
    paragraphs: [
      "We and our service providers may process and store information in countries other than the country in which you reside, including the United States and other jurisdictions where our service providers operate. These countries may have data protection laws that differ from those of your jurisdiction.",
      "Where required by applicable law, we implement appropriate safeguards for cross-border transfers of personal information, such as standard contractual clauses or equivalent mechanisms, to help ensure your information receives an adequate level of protection.",
    ],
  },
  {
    title: "Your Privacy Rights",
    paragraphs: [
      "Depending on your location, you may have certain rights regarding your personal information, which may include the right to:",
    ],
    bullets: [
      "Access the personal information we hold about you",
      "Correct inaccurate or incomplete information",
      "Request deletion of your personal information, subject to certain exceptions",
      "Object to or restrict certain processing of your information",
      "Request a copy of your information in a portable format",
      "Withdraw consent, where processing is based on consent",
      "Opt out of certain data sharing, marketing communications, or automated processing, as applicable",
    ],
    closing: [
      `To exercise any of these rights, please contact us using the details in Contact Information. We will respond to verified requests in accordance with applicable law. We will not discriminate against you for exercising your privacy rights.`,
    ],
  },
  {
    title: "Children's Privacy",
    paragraphs: [
      "The Site is intended for a professional audience, including journalists, partners, and investors, and is not directed to children. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us using the details in Contact Information, and we will take appropriate steps to delete that information.",
    ],
  },
  {
    title: "Press Updates and Communications",
    paragraphs: [
      "If you sign up for press alerts or updates, we may send you communications about new content, press materials, or updates related to the Site. You may opt out at any time by using the unsubscribe link in those communications or by contacting us using the details in Contact Information.",
      "We do not use press-inbox contact details for behavioral advertising, and we do not sell your information to third parties for their own marketing purposes.",
    ],
  },
  {
    title: "Changes to This Privacy Policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will update the effective date at the top of this Privacy Policy and, where required by law, provide additional notice, such as posting the updated policy on the Site.",
      "Your continued use of the Site after any changes to this Privacy Policy become effective constitutes your acceptance of the revised policy. We encourage you to review this Privacy Policy periodically.",
    ],
  },
  {
    title: "Contact Information",
    paragraphs: [
      "If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:",
      `Email: ${LEGAL_CONTACT_EMAIL}`,
      `Website: ${LEGAL_SITE_HOST}`,
      "This Privacy Policy is provided for general informational purposes as part of Jasper Fu's commitment to transparency and does not constitute legal advice.",
    ],
  },
] satisfies LegalCopySection[]);

export const cookieSections = assertLegalSections([
  {
    title: "Introduction",
    paragraphs: [
      `This Cookie Policy explains how Jasper Fu ("we," "us," or "our"), co-founder and CEO of Coinsub, Inc., uses cookies and similar technologies on our website at ${LEGAL_SITE_HOST}. This policy should be read alongside our Privacy Policy and Terms of Service.`,
      "By continuing to use the Site, or by accepting cookies through our consent banner where one is presented, you agree to the use of cookies as described below.",
    ],
  },
  {
    title: "What Are Cookies?",
    paragraphs: [
      "Cookies are small text files that are stored on your device (computer, tablet, or mobile phone) when you visit or use a website. Cookies allow a Site to recognize your device, remember your preferences, and support core functionality across sessions. First-party cookies are set by us; third-party cookies are set by another organization, such as an analytics provider or an embedded video host. Session cookies are deleted when you close your browser, while persistent cookies remain for a set period or until you delete them.",
    ],
  },
  {
    title: "Types of Cookies We Use",
    paragraphs: [
      "We use the following categories of cookies on the Site:",
    ],
    bullets: [
      "Strictly Necessary Cookies. These cookies are required for the Site to function and to be secure, for example load balancing, security, and remembering your cookie choices. These cannot be switched off in our systems and do not require consent.",
      "Functional Cookies. These cookies remember choices you make on the Site, such as your cookie preferences, so that your experience feels consistent each time you return.",
      "Analytics and Performance Cookies. These cookies help us understand how visitors use the Site, for example which press releases or interview clips are viewed, so that we can improve content and structure. These are used only where permitted by law or with your consent.",
      "Third-Party and Embedded Content Cookies. These cookies may be set by third-party content embedded on the Site, such as YouTube videos or other media hosted on third-party platforms. They are governed by the applicable third party's own cookie and privacy practices, which we do not control.",
      "Targeting and Advertising Cookies. We do not currently use targeting or advertising cookies to build a profile of your interests on the Site.",
    ],
  },
  {
    title: "How We Use Cookies",
    paragraphs: [
      "We use cookies to operate, secure, and improve the Site. This includes keeping the Site secure, remembering your cookie choices, understanding how our content is used, and maintaining stability and performance. Strictly necessary cookies are required for the Site to function and cannot be switched off through our systems, while other cookies are used only where permitted by law or with your consent.",
      "Where required by law, including in the EEA and UK, we set non-essential cookies only after you consent through our cookie banner, and we rely on your consent as the legal basis for those cookies. Strictly necessary cookies are set on the basis of our legitimate interest in operating a secure, functioning Site and do not require consent. Trusted third-party service providers may also place cookies on the Site on our behalf, such as analytics or embedded-media providers; any such cookies are subject to the applicable third party's own privacy and cookie practices.",
    ],
  },
  {
    title: "Managing Your Cookie Preferences",
    paragraphs: [
      'You can manage or delete cookies at any time through your browser settings. Most browsers allow you to view, block, or remove cookies, and to set preferences for specific websites. Where a cookie consent banner is presented, you can accept or reject non-essential cookies and change your choice later using the cookie settings link. Because there is no common industry standard for "Do Not Track" signals, the Site does not currently respond to them.',
      "Please note that disabling certain cookies, particularly strictly necessary cookies, may affect the functionality of the Site. This may include reduced performance or loss of saved preferences for certain features.",
    ],
  },
  {
    title: "Changes to This Cookie Policy",
    paragraphs: [
      "We may update this Cookie Policy from time to time to reflect changes in the cookies we use or for legal reasons. Any updates will be posted on this page with a revised effective date. Material changes to non-essential cookies will, where required, be accompanied by a renewed consent request. We encourage you to review this policy periodically to stay informed about how we use cookies.",
    ],
  },
  {
    title: "Contact Information",
    paragraphs: [
      "If you have any questions about this Cookie Policy or how we use cookies, please contact us using the details below.",
      `Email: ${LEGAL_CONTACT_EMAIL}`,
      `Website: ${LEGAL_SITE_HOST}`,
    ],
  },
] satisfies LegalCopySection[]);
