import React from 'react'
import { LegalPageLayout } from '@/components/LegalPageLayout'

export default function CookiePolicyPage() {
  const sections = [
    { id: 'introduction',    title: '1. Introduction' },
    { id: 'what-are-cookies',title: '2. What Are Cookies' },
    { id: 'types',           title: '3. Types of Cookies We Use' },
    { id: 'how-we-use',      title: '4. How We Use Cookies' },
    { id: 'third-party',     title: '5. Third-Party Cookies' },
    { id: 'managing',        title: '6. Managing Cookies' },
    { id: 'updates',         title: '7. Policy Updates' },
    { id: 'contact',         title: '8. Contact' },
  ]

  return (
    <LegalPageLayout title="Cookie Policy" lastUpdated="June 2026" sections={sections}>

      <section id="introduction">
        <h2><span>01</span>Introduction</h2>
        <p>CS Vertex ("we", "us", or "our") uses cookies and similar tracking technologies on the CS Vertex website (<a href="https://csvertex.com">csvertex.com</a>) and its associated platforms, including the Client Portal and Admin CMS. This Cookie Policy explains what cookies are, the types of cookies we use, how we use them, and your choices regarding cookies.</p>
        <p>By using the CS Vertex website, you consent to our use of cookies as described in this policy. If you do not agree to our use of cookies, you may adjust your browser settings to refuse cookies. Please note that disabling certain cookies may affect the functionality of our website and services.</p>
        <p>This Cookie Policy should be read alongside our <a href="/privacy">Privacy Policy</a>, which provides broader information about how we collect, process, and protect your personal data.</p>
      </section>

      <section id="what-are-cookies">
        <h2><span>02</span>What Are Cookies</h2>
        <p>Cookies are small text files that are stored on your computer, tablet, or mobile device when you visit a website. They are widely used by websites to make them function correctly, work more efficiently, and to provide website operators with information about how users interact with their site.</p>
        <p>Cookies do not contain executable code and cannot access information stored on your device beyond what is needed for the purposes described in this policy. They are not harmful to your device and do not carry viruses or malware.</p>
        <p>In addition to traditional cookies, we may also use similar tracking technologies such as web beacons, pixel tags, and local storage objects that serve equivalent purposes. For the purposes of this policy, we refer to all such technologies collectively as "cookies".</p>
      </section>

      <section id="types">
        <h2><span>03</span>Types of Cookies We Use</h2>
        <p>CS Vertex uses the following categories of cookies on its website and platforms:</p>

        <p><strong>Essential Cookies</strong></p>
        <p>These cookies are strictly necessary for the website and associated platforms to function correctly. They enable core functionality such as session management, user authentication, security, and navigation. The CS Vertex Admin CMS and Client Portal rely on essential cookies for login sessions and access control. These cookies cannot be disabled without significantly impairing website functionality.</p>

        <p><strong>Functional Cookies</strong></p>
        <p>Functional cookies remember your preferences and settings to enhance your experience on our website. They may remember your preferred language, display settings, form data, or which notifications you have dismissed. These cookies make the website more personalised and convenient to use across sessions.</p>

        <p><strong>Performance Cookies</strong></p>
        <p>Performance cookies collect information about how visitors use our website — such as which pages are visited most often, how long users spend on each page, and any error messages encountered. All information collected by performance cookies is aggregated and anonymised. This data helps us understand user behaviour and continuously improve the website experience.</p>

        <p><strong>Analytics Cookies</strong></p>
        <p>We use analytics cookies to understand website traffic, user demographics, and engagement patterns. These cookies may be set by analytics platforms such as Google Analytics. They help us measure the effectiveness of our content, marketing activities, and service pages. Analytics data is used in aggregated form and is not used to identify individual users.</p>

        <p><strong>Preference Cookies</strong></p>
        <p>Preference cookies allow the website to remember choices you make (such as your preferred theme, region, or interaction settings) and provide enhanced, personalised features. These cookies make return visits more efficient and enjoyable.</p>
      </section>

      <section id="how-we-use">
        <h2><span>04</span>How We Use Cookies</h2>
        <p>CS Vertex uses cookies for the following purposes:</p>
        <ul>
          <li><strong>Authentication & Security:</strong> Maintaining secure login sessions for the Client Portal and Admin CMS. Protecting against CSRF attacks and unauthorised access.</li>
          <li><strong>Website Functionality:</strong> Enabling core website features, navigation, and interactive elements to work correctly.</li>
          <li><strong>User Preferences:</strong> Remembering your settings and preferences across sessions so you don't have to reconfigure them on each visit.</li>
          <li><strong>Analytics & Improvement:</strong> Analysing how users interact with our website to identify areas for improvement, optimise page performance, and enhance content relevance.</li>
          <li><strong>Form Completion:</strong> Temporarily storing form data to prevent loss of information during multi-step processes such as quote requests or support ticket submissions.</li>
          <li><strong>Performance Monitoring:</strong> Detecting technical errors, monitoring page load times, and identifying performance bottlenecks on our platform.</li>
        </ul>
        <p>CS Vertex does not use cookies for targeted advertising, selling data to third parties, or tracking users across other websites.</p>
      </section>

      <section id="third-party">
        <h2><span>05</span>Third-Party Cookies</h2>
        <p>Some cookies on the CS Vertex website are set by third-party service providers we use to operate and improve our platform. These include:</p>
        <ul>
          <li><strong>Google Analytics:</strong> Used to track website traffic, user behaviour, and engagement metrics. Google Analytics uses anonymised data and does not identify individual users. Review <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a>.</li>
          <li><strong>Supabase:</strong> Our backend platform uses cookies for session management and authentication in the Client Portal. Review <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Supabase's Privacy Policy</a>.</li>
          <li><strong>GitHub:</strong> If you connect your GitHub account or access GitHub-integrated features, GitHub may set cookies. Review <a href="https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement" target="_blank" rel="noopener noreferrer">GitHub's Privacy Statement</a>.</li>
        </ul>
        <p>CS Vertex does not control third-party cookies. Each third-party service provider has its own privacy and cookie policies, and we encourage you to review them. We work only with reputable third-party providers and limit the data they access to what is necessary for their function.</p>
      </section>

      <section id="managing">
        <h2><span>06</span>Managing Cookies</h2>
        <p>You can control and manage cookies in several ways. Most modern browsers allow you to view, block, and delete cookies through their settings. Below are links to cookie management instructions for popular browsers:</p>
        <ul>
          <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
          <li><a href="https://support.mozilla.org/kb/enhanced-tracking-protection-firefox-desktop" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
          <li><a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer">Apple Safari</a></li>
          <li><a href="https://support.microsoft.com/help/4468242/microsoft-edge-browsing-data-and-privacy" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
        </ul>
        <p>Please be aware that restricting or disabling cookies may impact the functionality of our website. In particular:</p>
        <ul>
          <li>Disabling essential cookies will prevent you from logging in to the Client Portal or Admin CMS.</li>
          <li>Disabling functional cookies may cause your preferences not to be saved between sessions.</li>
          <li>Disabling analytics cookies will not affect your ability to use the website, but will reduce our ability to improve our services based on usage data.</li>
        </ul>
      </section>

      <section id="updates">
        <h2><span>07</span>Policy Updates</h2>
        <p>CS Vertex may update this Cookie Policy from time to time to reflect changes in technology, legislation, our services, or our cookie practices. When we make material changes to this policy, we will update the "Last Updated" date at the top of this page and, where appropriate, notify registered users through the platform or via email.</p>
        <p>We encourage you to review this Cookie Policy periodically to stay informed about how we use cookies. Your continued use of the CS Vertex website following any changes to this policy constitutes your acceptance of the revised Cookie Policy.</p>
      </section>

      <section id="contact">
        <h2><span>08</span>Contact</h2>
        <p>If you have any questions about our use of cookies or this Cookie Policy, please contact us:</p>
        <p><a href="mailto:hello@csvertex.com">hello@csvertex.com</a></p>
        <p>We are happy to explain our cookie practices in more detail and address any concerns you may have regarding your privacy and data on the CS Vertex website.</p>
      </section>

    </LegalPageLayout>
  )
}
