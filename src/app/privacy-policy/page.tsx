import React from 'react'
import { LegalPageLayout } from '@/components/LegalPageLayout'

export default function PrivacyPolicy() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="June 12, 2026">
      <h2>1. Introduction</h2>
      <p>At CS Vertex, we are committed to protecting the privacy and security of our clients, users, and website visitors. This Privacy Policy outlines how we collect, use, and safeguard your data.</p>
      
      <h2>2. Data Collection</h2>
      <p>We may collect personal identification information including, but not limited to:</p>
      <ul>
        <li>Name, email address, and phone number when submitted via our contact or quote forms.</li>
        <li>Usage data and analytics when browsing our website.</li>
        <li>Professional information submitted through internship or career applications.</li>
      </ul>

      <h2>3. How We Use Your Data</h2>
      <p>We use the collected information for various purposes:</p>
      <ul>
        <li>To provide and maintain our engineering services.</li>
        <li>To notify you about changes to our services or respond to your inquiries.</li>
        <li>To monitor the usage of our website and improve user experience.</li>
      </ul>

      <h2>4. Data Protection & Security</h2>
      <p>CS Vertex employs enterprise-grade security protocols to prevent unauthorized access to your data. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>

      <h2>5. User Rights</h2>
      <p>Depending on your location, you may have rights regarding your personal data, including the right to access, update, or delete the information we hold about you.</p>

      <h2>6. Contact Us</h2>
      <p>If you have any questions about this Privacy Policy, please contact us at privacy@csvertex.com.</p>
    </LegalPageLayout>
  )
}
