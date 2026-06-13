import React from 'react'
import { LegalPageLayout } from '@/components/LegalPageLayout'

export default function TermsAndConditions() {
  return (
    <LegalPageLayout title="Terms & Conditions" lastUpdated="June 12, 2026">
      <h2>1. Agreement to Terms</h2>
      <p>By accessing or using the CS Vertex website and services, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, then you may not access our services.</p>

      <h2>2. Intellectual Property</h2>
      <p>The Service and its original content, features, and functionality are and will remain the exclusive property of CS Vertex and its licensors. Our intellectual property may not be used in connection with any product or service without the prior written consent of CS Vertex.</p>

      <h2>3. User Responsibilities</h2>
      <p>When using our platforms, you agree not to:</p>
      <ul>
        <li>Engage in any activity that disrupts or interferes with our services.</li>
        <li>Attempt to gain unauthorized access to our systems or administrative dashboards.</li>
        <li>Submit false or misleading information through our forms.</li>
      </ul>

      <h2>4. Service Limitations & Availability</h2>
      <p>We strive to ensure high availability of our digital products. However, CS Vertex reserves the right to modify, suspend, or discontinue any service at any time without prior notice.</p>

      <h2>5. Limitation of Liability</h2>
      <p>In no event shall CS Vertex, nor its directors, employees, partners, or agents, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use our services.</p>
    </LegalPageLayout>
  )
}
