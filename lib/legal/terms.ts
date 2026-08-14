import {
  LEGAL_CONTACT_EMAIL,
  LEGAL_SITE_HOST,
  LEGAL_UPDATED,
  type LegalCopySection,
  assertLegalSections,
} from "./published";

export const termsUpdated = LEGAL_UPDATED;

export const termsSections = assertLegalSections([
  {
    title: "Agreement to These Terms",
    paragraphs: [
      `These Terms of Service ("Terms") are a legal agreement between you and Jasper Fu ("Jasper," "we," "us," or "our") governing your access to and use of the website located at ${LEGAL_SITE_HOST}, including its biography, press and media resources, downloadable assets, and any content made available on it (collectively, the "Site"). By accessing or using the Site, you agree to be bound by these Terms and by our Privacy Policy and Cookie Policy, which are incorporated by reference. If you do not agree, do not use the Site.`,
    ],
  },
  {
    title: "Eligibility",
    paragraphs: [
      "You may use the Site only if you can form a binding contract with Jasper Fu and are not barred from doing so under applicable law. By using the Site, you represent that you meet these requirements and that your use of the Site complies with all applicable laws.",
    ],
  },
  {
    title: "Scope; Relationship to Coinsub",
    paragraphs: [
      "The Site is a personal, informational, and press resource for Jasper Fu. These Terms govern only your use of the Site.",
      "These Terms do not govern, and do not create any right to use, Coinsub, Inc.'s payment products, applications, APIs, or services, or those of any other company Jasper Fu is involved with, which are provided under their own separate agreements. Nothing on the Site creates a customer, merchant, agency, partnership, joint-venture, employment, or fiduciary relationship.",
    ],
  },
  {
    title: "Permitted Use of the Site",
    paragraphs: [
      "Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, revocable license to access and view the Site for your own informational, journalistic, or business-evaluation purposes.",
      "All rights not expressly granted are reserved. We may modify, suspend, or discontinue any part of the Site at any time, with or without notice, as described in Changes to the Site.",
    ],
  },
  {
    title: "Press and Media Materials; Limited License",
    paragraphs: [
      'Certain materials on the Site are made available specifically for press and media use, for example headshots, biography, boilerplate copy, fact sheets, and approved statements or press releases ("Press Materials"). Subject to these Terms and any usage guidelines published alongside them, we grant journalists, publishers, and partners a limited, non-exclusive, revocable license to use the Press Materials solely to report on, describe, or reference Jasper Fu.',
      "This license is conditioned on you using the Press Materials accurately and in a non-misleading way, only in connection with editorial or informational coverage of Jasper Fu; not altering photographs or brand assets except for proportional resizing; not implying endorsement, sponsorship, or affiliation without our prior written consent; and attributing images and quotes as indicated. We may revoke this license at any time, and you must stop using the Press Materials on request.",
      "Use of any Coinsub or third-party logos shown on the Site may require the separate permission of Coinsub or those third parties.",
    ],
  },
  {
    title: "Forward-Looking Statements; No Reliance",
    paragraphs: [
      'The Site and Press Materials may contain forward-looking statements about Jasper Fu or about Coinsub, Inc., including projections such as targeted business or revenue milestones ("Forward-Looking Statements").',
      "Forward-Looking Statements are not guarantees of future performance and are subject to risks and uncertainties. They are qualified in their entirety by our Forward-Looking Disclaimer, where published, which is incorporated by reference.",
      "You should not place undue reliance on any Forward-Looking Statement. Actual results may differ materially from those expressed or implied.",
    ],
  },
  {
    title: "No Offer; No Professional Advice",
    paragraphs: [
      "Nothing on the Site constitutes, or should be construed as, an offer to sell or a solicitation of an offer to buy any security or other financial instrument, or investment, financial, legal, tax, or accounting advice, or a recommendation to enter into any transaction.",
      "Any offer of securities, if made, would be made only through definitive offering materials and in compliance with applicable law.",
    ],
  },
  {
    title: "Intellectual Property",
    paragraphs: [
      "Jasper Fu and his licensors own all right, title, and interest in and to the Site, including its text, photographs, graphics, logos, images, video, and the selection and arrangement of content, and all related intellectual property. Jasper Fu's name, image, and likeness may not be used except as permitted in Press and Media Materials; Limited License. Nothing in these Terms grants you any right to use Jasper Fu's or Coinsub's trademarks, logos, or branding without prior written consent.",
      "Except for the limited licenses granted in Permitted Use of the Site and Press and Media Materials; Limited License, nothing in these Terms transfers any intellectual property right to you.",
    ],
  },
  {
    title: "Third-Party Links and Content",
    paragraphs: [
      "The Site may contain links to, and embeds of, third-party websites, videos, and content that we do not control, including content relating to Coinsub, Inc.",
      "We provide these links and embeds for your convenience.",
      "We do not endorse, and are not responsible for, any third-party content, products, or practices, and we do not review third-party sites for accuracy or completeness.",
      "Your use of any third-party website, platform, or service is governed by that third party's own terms and privacy practices, and not by these Terms.",
      "Inclusion of a link or embed on the Site does not imply any affiliation, sponsorship, or endorsement by Jasper Fu or Coinsub, Inc. unless expressly stated.",
    ],
  },
  {
    title: "Prohibited Conduct",
    paragraphs: [
      "When using the Site, you agree that you will not:",
    ],
    bullets: [
      "Use the Site in violation of any law or these Terms.",
      "Copy, scrape, harvest, or systematically extract Site content, except as permitted for press use under Press and Media Materials; Limited License or by applicable law.",
      "Interfere with or disrupt the Site, its security, or its servers, or attempt to gain unauthorized access.",
      "Introduce malware or any harmful code, or engage in denial-of-service activity.",
      "Misrepresent your identity or affiliation, or use the Site to defraud or mislead.",
      "Use the Site or Press Materials in a way that infringes or misappropriates any third party's rights.",
    ],
    closing: [
      "We reserve the right to investigate and take appropriate action against anyone who violates this Section, including removing content, revoking any license granted under these Terms, or restricting access to the Site.",
    ],
  },
  {
    title: "Suspension of Access; Revocation of License",
    paragraphs: [
      "We may suspend or restrict access to the Site, or revoke any license granted under these Terms, including the Press Materials license in Press and Media Materials; Limited License, at any time, with or without notice, if we reasonably believe you have violated these Terms or applicable law.",
      "You may stop using the Site at any time. These Terms will survive termination of your access to the extent necessary to give effect to their intent.",
    ],
  },
  {
    title: "Disclaimer of Warranties",
    paragraphs: [
      'THE SITE AND ALL CONTENT AND PRESS MATERIALS ARE PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SITE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE, OR THAT ANY CONTENT IS ACCURATE, COMPLETE, OR CURRENT.',
    ],
  },
  {
    title: "Limitation of Liability",
    paragraphs: [
      "TO THE MAXIMUM EXTENT PERMITTED BY LAW, JASPER FU AND HIS AGENTS AND REPRESENTATIVES WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR GOODWILL, ARISING OUT OF OR RELATING TO YOUR USE OF OR INABILITY TO USE THE SITE OR PRESS MATERIALS, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.",
    ],
  },
  {
    title: "Indemnification",
    paragraphs: [
      "You agree to indemnify, defend, and hold harmless Jasper Fu and his agents and representatives from and against any claims, liabilities, damages, losses, and expenses, including reasonable legal fees, arising out of your use of the Site or Press Materials in breach of these Terms or applicable law.",
    ],
  },
  {
    title: "Changes to the Site",
    paragraphs: [
      "We may modify, suspend, or discontinue any part of the Site at any time, with or without notice. We will use reasonable efforts to communicate material changes that significantly affect your use of the Site.",
    ],
  },
  {
    title: "Changes to These Terms",
    paragraphs: [
      `We may update these Terms from time to time to reflect changes in our practices or legal requirements. The "Last updated" date shows when they were last revised. Your continued use of the Site after changes take effect constitutes your acceptance of the updated Terms.`,
    ],
  },
  {
    title: "Governing Law and Dispute Resolution",
    paragraphs: [
      "These Terms are governed by and construed in accordance with the laws applicable in which Jasper Fu and Coinsub operate, without regard to conflict of law principles. Any disputes arising from these Terms or the Services will be resolved in accordance with that jurisdiction's applicable rules and procedures.",
    ],
  },
  {
    title: "Contact Information",
    paragraphs: [
      "If you have any questions about these Terms, please contact us using the details below.",
      `Email: ${LEGAL_CONTACT_EMAIL}`,
      `Website: ${LEGAL_SITE_HOST}`,
    ],
  },
] satisfies LegalCopySection[]);
