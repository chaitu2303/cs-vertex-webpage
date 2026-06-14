import React from 'react'
import { LegalPageLayout } from '@/components/LegalPageLayout'

export default function TermsPage() {
  const sections = [
    { id: 'acceptance', title: '1. Acceptance of Terms' },
    { id: 'services', title: '2. Services Provided' },
    { id: 'intellectual-property', title: '3. Intellectual Property' },
    { id: 'user-responsibilities', title: '4. User Responsibilities' },
    { id: 'limitation', title: '5. Limitation of Liability' }
  ]

  return (
    <LegalPageLayout title="Terms & Conditions" lastUpdated="June 2026" sections={sections}>
      <section id="acceptance">
        <h2><span>01</span>Acceptance of Terms</h2>
        <p>By accessing and using the CS Vertex website, you accept and agree to be bound by the terms and provision of this agreement. Any participation in this service will constitute acceptance of this agreement. If you do not agree to abide by the above, please do not use this service.</p>
      </section>

      <section id="services">
        <h2><span>02</span>Services Provided</h2>
        <p>CS Vertex provides enterprise software development, artificial intelligence integration, robotics, and embedded systems engineering. The specific scope, deliverables, and timelines for each project will be outlined in a dedicated Master Service Agreement (MSA) or Statement of Work (SOW).</p>
        <p>We reserve the right to withdraw or amend our service, and any service or material we provide on the Website, in our sole discretion without notice.</p>
      </section>

      <section id="intellectual-property">
        <h2><span>03</span>Intellectual Property</h2>
        <p>The Service and its original content, features and functionality are and will remain the exclusive property of CS Vertex and its licensors. The Service is protected by copyright, trademark, and other laws.</p>
        <p>Our intellectual property may not be used in connection with any product or service without the prior written consent of CS Vertex.</p>
      </section>

      <section id="user-responsibilities">
        <h2><span>04</span>User Responsibilities</h2>
        <p>When using our platforms, you agree not to:</p>
        <ul>
          <li>Engage in any activity that disrupts or interferes with our services.</li>
          <li>Attempt to gain unauthorized access to our systems, administrative dashboards, or customer portals.</li>
          <li>Submit false, misleading, or defamatory information through our forms.</li>
          <li>Use the platform for any illegal or unauthorized purpose.</li>
        </ul>
      </section>

      <section id="limitation">
        <h2><span>05</span>Limitation of Liability</h2>
        <p>In no event shall CS Vertex, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:</p>
        <ul>
          <li>Your access to or use of or inability to access or use the Service.</li>
          <li>Any conduct or content of any third party on the Service.</li>
          <li>Any content obtained from the Service.</li>
          <li>Unauthorized access, use or alteration of your transmissions or content.</li>
        </ul>
      </section>
    </LegalPageLayout>
  )
}
