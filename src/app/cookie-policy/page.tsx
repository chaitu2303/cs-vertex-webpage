import React from 'react'
import { LegalPageLayout } from '@/components/LegalPageLayout'

export default function CookiePolicy() {
  return (
    <LegalPageLayout title="Cookie Policy" lastUpdated="June 12, 2026">
      <h2>1. What Are Cookies?</h2>
      <p>Cookies are small text files that are placed on your computer or mobile device when you browse websites. They are widely used to make websites work, or work more efficiently, as well as to provide reporting information.</p>

      <h2>2. How We Use Cookies</h2>
      <p>CS Vertex uses cookies to:</p>
      <ul>
        <li>Understand and save user preferences for future visits.</li>
        <li>Compile aggregate data about site traffic and site interactions in order to offer better site experiences and tools in the future.</li>
        <li>Authenticate administrators into the CS Vertex CMS Dashboard.</li>
      </ul>

      <h2>3. Types of Cookies We Use</h2>
      <ul>
        <li><strong>Strictly Necessary Cookies:</strong> Required for the operation of our website, including admin authentication.</li>
        <li><strong>Analytical/Performance Cookies:</strong> Allow us to recognize and count the number of visitors and see how visitors move around our website.</li>
        <li><strong>Functionality Cookies:</strong> Used to recognize you when you return to our website.</li>
      </ul>

      <h2>4. Managing Cookies</h2>
      <p>You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website, such as the Admin Portal, may become inaccessible or not function properly.</p>
    </LegalPageLayout>
  )
}
