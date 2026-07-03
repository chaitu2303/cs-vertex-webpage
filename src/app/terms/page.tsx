import React from 'react'
import { LegalPageLayout } from '@/components/LegalPageLayout'

export default function TermsConditionsPage() {
  const sections = [
    { id: 'introduction', title: '1. Introduction' },
    { id: 'services', title: '2. Services Provided' },
    { id: 'user-responsibilities', title: '3. User Responsibilities' },
    { id: 'intellectual-property', title: '4. Intellectual Property' },
    { id: 'payment', title: '5. Payment & Billing' },
    { id: 'confidentiality', title: '6. Confidentiality' },
    { id: 'limitation-liability', title: '7. Limitation of Liability' },
    { id: 'termination', title: '8. Termination' },
    { id: 'governing-law', title: '9. Governing Law' },
    { id: 'changes', title: '10. Changes to Terms' },
    { id: 'contact', title: '11. Contact Information' },
  ]

  return (
    <LegalPageLayout title="Terms & Conditions" lastUpdated="June 2026" sections={sections}>
      <section id="introduction">
        <h2><span>01</span>Introduction</h2>
        <p>Welcome to CS Vertex. These Terms & Conditions outline the rules and regulations for the use of the CS Vertex website, our software development services, embedded hardware solutions, and any related applications or platforms operated by us.</p>
        <p>By accessing this website or engaging our services, we assume you accept these Terms & Conditions in full. Do not continue to use CS Vertex if you do not agree to take all of the terms and conditions stated on this page.</p>
        <p>These terms constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you" or "Client"), and CS Vertex ("Company", "we", "us", or "our"), concerning your access to and use of our services and platform.</p>
      </section>

      <section id="services">
        <h2><span>02</span>Services Provided</h2>
        <p>CS Vertex provides enterprise-grade technology services, including but not limited to custom software engineering, IoT and embedded systems design, artificial intelligence solutions, cybersecurity consulting, and robust web applications.</p>
        <p>We reserve the right to modify, suspend, or discontinue any specific service offering with or without notice. However, ongoing contractual agreements with active clients will be honored according to their respective Statements of Work (SOW) or Master Service Agreements (MSA).</p>
        <p>Any new features, tools, or resources added to our current platform or service portfolio shall also be subject to these Terms of Service.</p>
      </section>

      <section id="user-responsibilities">
        <h2><span>03</span>User Responsibilities</h2>
        <p>When utilizing our website or client portal, you agree to provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
        <p>You agree not to use our services for any illegal or unauthorized purpose. Furthermore, in the use of our services, you must not violate any laws in your jurisdiction, including but not limited to copyright laws or data privacy regulations.</p>
        <p>Any transmission of destructive code, worms, viruses, or attempts to compromise our system architecture will result in immediate termination of your services and potential legal action.</p>
      </section>

      <section id="intellectual-property">
        <h2><span>04</span>Intellectual Property</h2>
        <p>Unless otherwise stated in a custom service agreement, CS Vertex and/or its licensors own the intellectual property rights for all standard codebases, proprietary frameworks, and material on the CS Vertex website. All such intellectual property rights are reserved.</p>
        <p>For custom development projects, the transfer of Intellectual Property rights (such as source code ownership) will be strictly governed by the specific project contract signed between CS Vertex and the Client upon final payment.</p>
        <p>You may not republish, sell, rent, or sub-license material from CS Vertex without explicit written permission, nor may you reproduce, duplicate or copy our proprietary platform structures.</p>
      </section>

      <section id="payment">
        <h2><span>05</span>Payment & Billing</h2>
        <p>Payment terms for specific projects, retainers, or SaaS offerings will be explicitly detailed in your corresponding invoice or service contract. Unless otherwise specified, all invoices are payable within the timeframe stated on the document.</p>
        <p>We reserve the right to suspend or terminate services, including hosting and ongoing maintenance, if accounts are severely delinquent. Late payments may incur interest charges as permitted by applicable law.</p>
        <p>All fees are exclusive of all taxes, levies, or duties imposed by taxing authorities, and you shall be responsible for payment of all such taxes, levies, or duties, excluding only taxes based solely on CS Vertex's income.</p>
      </section>

      <section id="confidentiality">
        <h2><span>06</span>Confidentiality</h2>
        <p>Both parties agree to hold each other's proprietary or confidential information in strict confidence. "Confidential Information" shall include, but is not limited to, trade secrets, business plans, technical data, source code, and customer lists.</p>
        <p>Confidential Information shall not be disclosed to any third party without prior written consent, except to employees or contractors who need to know the information to fulfill the obligations of our service agreement.</p>
        <p>This confidentiality obligation shall survive the termination of any service agreement or the cessation of your use of our platform.</p>
      </section>

      <section id="limitation-liability">
        <h2><span>07</span>Limitation of Liability</h2>
        <p>In no event shall CS Vertex, nor any of its officers, directors, or employees, be held liable for any indirect, consequential, or special liability arising out of or in any way related to your use of our services or website.</p>
        <p>CS Vertex makes no representations or warranties of any kind, express or implied, regarding the continuous availability of our platform or the absolute security of data, given the inherent risks of internet-based services.</p>
        <p>Our total liability to you for any claim arising out of or relating to these Terms or our services shall not exceed the total amount paid by you to CS Vertex for the specific service giving rise to the claim during the twelve months preceding the incident.</p>
      </section>

      <section id="termination">
        <h2><span>08</span>Termination</h2>
        <p>We may terminate or suspend access to our services and your portal account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms & Conditions.</p>
        <p>Upon termination, your right to use the service will immediately cease. If you wish to terminate your account, you may simply discontinue using the service or notify us to formally close your account.</p>
        <p>All provisions of the Terms which by their nature should survive termination shall survive, including, without limitation, ownership provisions, warranty disclaimers, indemnity, and limitations of liability.</p>
      </section>

      <section id="governing-law">
        <h2><span>09</span>Governing Law</h2>
        <p>These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any legal action or proceeding relating to your access to, or use of, our services shall be instituted in a competent court in our jurisdiction.</p>
        <p>Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.</p>
        <p>These Terms constitute the entire agreement between us regarding our service, and supersede and replace any prior agreements we might have had between us regarding the service.</p>
      </section>

      <section id="changes">
        <h2><span>10</span>Changes to Terms</h2>
        <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
        <p>By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.</p>
        <p>We encourage clients to review this page periodically for any updates regarding our operational terms and conditions.</p>
      </section>

      <section id="contact">
        <h2><span>11</span>Contact Information</h2>
        <p>If you have any questions about these Terms & Conditions, please do not hesitate to contact us. We aim to ensure all client relationships are built on clarity and mutual understanding.</p>
        <p>For legal inquiries, contract clarifications, or general questions regarding these terms, contact us at:</p>
        <p><a href="mailto:hello@csvertex.com">hello@csvertex.com</a></p>
      </section>

    </LegalPageLayout>
  )
}
