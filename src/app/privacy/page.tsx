import React from 'react'
import { LegalPageLayout } from '@/components/LegalPageLayout'

export default function PrivacyPolicyPage() {
  const sections = [
    { id: 'introduction', title: '1. Introduction' },
    { id: 'information-collect', title: '2. Information We Collect' },
    { id: 'how-we-use', title: '3. How We Use Information' },
    { id: 'cookies', title: '4. Cookies & Tracking' },
    { id: 'data-protection', title: '5. Data Protection & Security' },
    { id: 'third-party', title: '6. Third-Party Services' },
    { id: 'data-retention', title: '7. Data Retention' },
    { id: 'user-rights', title: '8. Your Rights' },
    { id: 'children', title: "9. Children's Privacy" },
    { id: 'policy-updates', title: '10. Policy Updates' },
    { id: 'contact', title: '11. Contact Information' },
  ]

  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="June 2026" sections={sections}>
      <section id="introduction">
        <h2><span>01</span>Introduction</h2>
        <p>CS Vertex is committed to protecting your privacy and ensuring the security of your personal data. This Privacy Policy outlines how we collect, use, process, and safeguard your information when you visit our website, use our client portal, or engage our engineering services.</p>
        <p>We believe in transparency and data minimization. We only collect the information necessary to provide our services, communicate effectively, and improve our platform. CS Vertex operates on a strict principle: we never sell, rent, or trade your personal data to third parties for marketing purposes.</p>
        <p>By accessing our website or utilizing our services, you consent to the data practices described in this Privacy Policy. If you do not agree with any part of this policy, please refrain from using our platform.</p>
      </section>

      <section id="information-collect">
        <h2><span>02</span>Information We Collect</h2>
        <p>To deliver high-quality technology solutions and maintain effective communication, we collect various types of information. This includes personal data you provide directly, such as your name, email address, phone number, and company details when you submit a quote request, fill out a contact form, or create an account in our Client Portal.</p>
        <p>We also automatically collect technical data when you interact with our website. This may include your IP address, browser type, operating system, device identifiers, and network information. This technical data helps us ensure the security and optimal performance of our digital infrastructure.</p>
        <p>Additionally, we gather usage data related to how you navigate our platform, which pages you visit, and how you interact with our content. For clients engaging our services, we may also collect technical project requirements, specifications, and related documentation necessary for project execution.</p>
      </section>

      <section id="how-we-use">
        <h2><span>03</span>How We Use Information</h2>
        <p>The primary purpose of collecting your information is to provide, manage, and improve our enterprise software development and technology services. We use your personal data to process quote requests, facilitate onboarding, and deliver ongoing project updates and support.</p>
        <p>Your information is crucial for administrative purposes, including managing your account in the Client Portal, processing payments, and sending important notices regarding service changes or technical issues. We also analyze aggregated usage data to refine our platform's user experience and develop new features.</p>
        <p>Furthermore, we may use your information to comply with applicable legal obligations, resolve disputes, and enforce our agreements. As stated, we strictly use your data for operational and service delivery purposes and do not engage in selling data to external marketing agencies.</p>
      </section>

      <section id="cookies">
        <h2><span>04</span>Cookies & Tracking</h2>
        <p>Our platform utilizes cookies and similar tracking technologies to enhance your browsing experience and ensure core functionality. These include Essential cookies required for secure login sessions, and Functional cookies that remember your preferences across visits.</p>
        <p>We also deploy Performance and Analytics cookies to aggregate data on website traffic and user interactions, allowing us to continuously optimize our content and platform architecture. In some cases, Preference cookies may be used to customize your interface.</p>
        <p>You have the right to manage your cookie preferences through your web browser settings. While you can choose to disable non-essential cookies, please be aware that blocking essential cookies may prevent certain features, such as the Client Portal and Admin CMS, from functioning correctly.</p>
      </section>

      <section id="data-protection">
        <h2><span>05</span>Data Protection & Security</h2>
        <p>Security is a foundational element of our engineering culture. We implement industry-standard security measures, including strong encryption protocols, to protect your personal data both in transit (using SSL/TLS) and at rest within our secure databases.</p>
        <p>Access to personal data is strictly limited to authorized personnel who require it to perform their job functions. We enforce role-based access controls and conduct regular security audits to identify and mitigate potential vulnerabilities in our infrastructure.</p>
        <p>While we continuously strive to protect your data using commercially acceptable means, no method of transmission over the internet or electronic storage is entirely secure. Therefore, we cannot guarantee absolute security, but we remain vigilant in our protective measures and incident response readiness.</p>
      </section>

      <section id="third-party">
        <h2><span>06</span>Third-Party Services</h2>
        <p>To provide robust and reliable services, we integrate with reputable third-party service providers. These may include analytics platforms like Google Analytics, authentication providers like GitHub, backend infrastructure such as Firebase and Supabase, and secure payment processing partners.</p>
        <p>When you interact with these integrated services, they may collect information according to their own privacy policies. We share only the minimum necessary data required for these third parties to perform their specific functions on our behalf.</p>
        <p>We do not control the data practices of these third-party providers. We strongly encourage you to review their respective privacy policies to understand how they handle your information.</p>
      </section>

      <section id="data-retention">
        <h2><span>07</span>Data Retention</h2>
        <p>We retain your personal data only for as long as is necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. For active clients, data is retained for the duration of the service agreement and account lifecycle.</p>
        <p>General contact information and inquiry data are typically kept for a period of three years following our last interaction, to facilitate future communications or follow-up support. Technical and usage data may be retained in anonymized formats for long-term analytical purposes.</p>
        <p>If you request account deletion, we will securely erase your personal data, subject to any legal obligations that mandate retention, such as financial record-keeping or compliance requirements.</p>
      </section>

      <section id="user-rights">
        <h2><span>08</span>Your Rights</h2>
        <p>You maintain significant rights regarding your personal data. You have the right to request access to the information we hold about you, and to ask for corrections if any data is inaccurate or incomplete.</p>
        <p>Subject to certain conditions, you also possess the right to request the deletion of your personal data, to restrict our processing of it, or to object to its use. Additionally, you have the right to data portability, allowing you to receive your data in a structured, commonly used format.</p>
        <p>To exercise any of these rights, or to withdraw previously given consent for data processing, please contact our team at hello@csvertex.com. We will respond to all legitimate requests in a timely manner as required by applicable data protection laws.</p>
      </section>

      <section id="children">
        <h2><span>09</span>Children's Privacy</h2>
        <p>Our website, platform, and enterprise engineering services are intended for a general professional audience and are not directed at children under the age of 13. We do not design our services to attract minors.</p>
        <p>We do not knowingly collect, maintain, or process personal data from children under 13. If we become aware that we have inadvertently collected information from a minor, we will take immediate steps to securely delete that data from our systems.</p>
        <p>If you are a parent or guardian and believe your child has provided us with personal information without consent, please contact us immediately so we can take appropriate action.</p>
      </section>

      <section id="policy-updates">
        <h2><span>10</span>Policy Updates</h2>
        <p>We may periodically update this Privacy Policy to reflect changes in our operational practices, new technologies, or evolving legal and regulatory requirements. We reserve the right to modify this policy at any time.</p>
        <p>When material changes are made, we will notify you by updating the "Last Updated" date at the top of this page, and for significant alterations, we may provide a more prominent notice on our website or send an email notification to registered users.</p>
        <p>We encourage you to review this Privacy Policy regularly. Your continued use of the CS Vertex platform after any modifications indicates your acknowledgment of the changes and your agreement to abide by the updated policy.</p>
      </section>

      <section id="contact">
        <h2><span>11</span>Contact Information</h2>
        <p>We welcome your questions, comments, and concerns regarding this Privacy Policy and our privacy practices. CS Vertex is dedicated to addressing your inquiries promptly and transparently.</p>
        <p>If you wish to contact our privacy compliance team or exercise any of your data rights, please reach out to us via email at:</p>
        <p><a href="mailto:hello@csvertex.com">hello@csvertex.com</a></p>
      </section>

    </LegalPageLayout>
  )
}
