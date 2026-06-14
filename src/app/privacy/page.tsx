import React from 'react'
import { LegalPageLayout } from '@/components/LegalPageLayout'

export default function PrivacyPolicyPage() {
  const sections = [
    { id: 'data-collection', title: '1. Data Collection' },
    { id: 'use-of-information', title: '2. Use of Information' },
    { id: 'cookies-tracking', title: '3. Cookies & Tracking' },
    { id: 'data-security', title: '4. Data Security' },
    { id: 'contact-us', title: '5. Contact Us' }
  ]

  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="June 2026" sections={sections}>
      <section id="data-collection">
        <h2><span>01</span>Data Collection</h2>
        <p>At CS Vertex, we collect information that you provide directly to us when you request a quote, create an account, or communicate with us. This may include:</p>
        <ul>
          <li>Personal identification data (Name, email address, phone number)</li>
          <li>Company and professional details</li>
          <li>Technical project requirements and specifications</li>
        </ul>
      </section>

      <section id="use-of-information">
        <h2><span>02</span>Use of Information</h2>
        <p>We use the collected information to provide, maintain, and improve our services, process transactions, send technical notices, and respond to your comments and questions. We do not sell or share your personal information with third parties for marketing purposes.</p>
        <p>Your data is strictly used to deliver high-quality engineering services and maintain clear communication throughout the project lifecycle.</p>
      </section>

      <section id="cookies-tracking">
        <h2><span>03</span>Cookies & Tracking</h2>
        <p>Our website uses cookies and similar tracking technologies to analyze trends, administer the website, track users' movements around the website, and gather demographic information.</p>
        <p>You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.</p>
      </section>

      <section id="data-security">
        <h2><span>04</span>Data Security</h2>
        <p>We implement strict enterprise-grade security measures to protect your personal information. All data is encrypted at rest and in transit. Access to personal data is restricted to authorized personnel only.</p>
        <p>While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security over the internet.</p>
      </section>

      <section id="contact-us">
        <h2><span>05</span>Contact Us</h2>
        <p>If you have any questions about this Privacy Policy or how we handle your data, please contact our privacy compliance team at:</p>
        <p><a href="mailto:hello@csvertex.com">hello@csvertex.com</a></p>
      </section>
    </LegalPageLayout>
  )
}
