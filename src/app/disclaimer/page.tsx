import React from 'react'
import { LegalPageLayout } from '@/components/LegalPageLayout'

export default function DisclaimerPage() {
  const sections = [
    { id: 'general',          title: '1. General Information' },
    { id: 'no-guarantees',    title: '2. No Guarantees' },
    { id: 'tech-changes',     title: '3. Technology & Pricing Changes' },
    { id: 'third-party',      title: '4. Third-Party Logos & Trademarks' },
    { id: 'external-links',   title: '5. External Links' },
    { id: 'educational',      title: '6. Educational Content' },
    { id: 'learning-platform',title: '7. Learning Platform Disclaimer' },
    { id: 'liability',        title: '8. Limitation of Liability' },
    { id: 'contact',          title: '9. Contact' },
  ]

  return (
    <LegalPageLayout title="Disclaimer" lastUpdated="June 2026" sections={sections}>

      <section id="general">
        <h2><span>01</span>General Information</h2>
        <p>The information provided on the CS Vertex website (<a href="https://csvertex.com">csvertex.com</a>) is for general informational purposes only. All information on this website is provided in good faith. However, CS Vertex makes no representation or warranty of any kind — express or implied — regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on this website.</p>
        <p>CS Vertex is a technology startup specialising in software development, AI solutions, embedded systems, IoT, cybersecurity, and learning programs. The content on this website reflects our service offerings, company information, and educational resources. While we strive to keep all information current and accurate, technology moves rapidly and details may change without prior notice.</p>
        <p>Nothing on this website constitutes formal engineering advice, legal counsel, financial guidance, or professional consulting. For specific project requirements, please formally engage our team through an official consultation or project agreement.</p>
      </section>

      <section id="no-guarantees">
        <h2><span>02</span>No Guarantees</h2>
        <p>CS Vertex does not guarantee uninterrupted access to or the continuous availability of this website. We do not warrant that the website will be error-free, secure, or free from viruses or other harmful components. While we take all reasonable measures to maintain the website's performance and reliability, technical issues may occasionally arise.</p>
        <p>We do not guarantee specific business outcomes, revenue growth, performance improvements, or technical results from using our services. Each project is unique, and results depend on many factors including the client's industry, target audience, content quality, implementation quality, and ongoing maintenance.</p>
        <p>Testimonials, case studies, and project examples featured on this website represent individual experiences and are not guarantees of future outcomes for other clients.</p>
      </section>

      <section id="tech-changes">
        <h2><span>03</span>Technology & Pricing Changes</h2>
        <p>The technology industry evolves rapidly. Technology stacks, frameworks, tools, platforms, and programming languages referenced on this website may be updated, replaced, or deprecated over time. CS Vertex continuously evaluates and adopts current best practices and technologies for client projects.</p>
        <p>Service offerings, project pricing, internship fees, course fees, workshop charges, and availability are subject to change without prior notice. All pricing displayed or communicated is indicative only. Final pricing is confirmed after detailed requirement analysis and mutual agreement, documented in a formal proposal or agreement.</p>
        <p>Delivery timelines, project estimates, and technology recommendations provided on this website are approximations based on typical project parameters and may vary significantly depending on project complexity, scope, client feedback cycles, and other factors specific to each engagement.</p>
      </section>

      <section id="third-party">
        <h2><span>04</span>Third-Party Logos & Trademarks</h2>
        <p>The CS Vertex website may display logos, brand names, trademarks, and service marks of third-party companies and technologies. These include but are not limited to programming languages, frameworks, cloud platforms, tools, and technology partners referenced in our service descriptions and technology stacks.</p>
        <p>All third-party trademarks, logos, brand names, and product names displayed on this website remain the exclusive intellectual property of their respective owners. Their display on the CS Vertex website does not imply endorsement, partnership, sponsorship, or affiliation unless explicitly stated.</p>
        <p>CS Vertex respects all intellectual property rights. If you believe any content on this website infringes your intellectual property, please contact us at <a href="mailto:hello@csvertex.com">hello@csvertex.com</a>.</p>
      </section>

      <section id="external-links">
        <h2><span>05</span>External Links</h2>
        <p>This website may contain links to external websites, third-party platforms, social media profiles, and resources that are not operated or controlled by CS Vertex. These links are provided for your convenience and reference only. CS Vertex has no control over the content, privacy policies, or practices of any third-party website.</p>
        <p>The inclusion of any external link on the CS Vertex website does not imply endorsement, recommendation, or approval of the linked website or its content. CS Vertex is not responsible for any loss, damage, or harm that may result from accessing or relying on third-party content accessed through links on this website.</p>
        <p>We recommend reviewing the privacy policy and terms of service of any external website before providing personal information or engaging with their services.</p>
      </section>

      <section id="educational">
        <h2><span>06</span>Educational Content</h2>
        <p>CS Vertex publishes technical articles, guides, tutorials, and educational content as part of its commitment to knowledge sharing and community engagement. This content is provided for educational and informational purposes only.</p>
        <p>Educational content on this website reflects the understanding and practices of CS Vertex at the time of publication. Given the dynamic nature of technology, some information may become outdated. Readers are encouraged to verify technical information and consult multiple sources before implementing solutions in production environments.</p>
        <p>CS Vertex does not accept responsibility for any errors, omissions, or outcomes resulting from the use of educational content published on this website.</p>
      </section>

      <section id="learning-platform">
        <h2><span>07</span>Learning Platform Disclaimer</h2>
        <p>The CS Vertex Learning Platform offers internships, courses, workshops, and bootcamps to students and professionals. The following disclaimers apply specifically to learning programs:</p>
        <ul>
          <li><strong>Schedules & Availability:</strong> Internship cohort dates, course launch dates, workshop schedules, and batch availability may change without prior notice based on enrollment numbers, mentor availability, and operational requirements.</li>
          <li><strong>Curriculum:</strong> Course content, learning materials, technology stacks covered, and program structure may be updated, modified, or revised to reflect current industry standards without prior notice.</li>
          <li><strong>Certificates:</strong> Certificates issued by CS Vertex are internal credentials that recognize program completion. They are not the same as government-accredited academic qualifications or industry-recognized certifications from established certification bodies.</li>
          <li><strong>Placement:</strong> CS Vertex provides career guidance, resume support, and interview preparation as part of its learning programs. However, CS Vertex does not guarantee employment, internship placement, or specific salary outcomes for program participants.</li>
          <li><strong>Fees:</strong> Program fees, duration, eligibility criteria, and syllabus are subject to change. Updated information will be communicated through official channels.</li>
        </ul>
      </section>

      <section id="liability">
        <h2><span>08</span>Limitation of Liability</h2>
        <p>To the fullest extent permitted by applicable law, CS Vertex and its directors, employees, partners, agents, and affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, goodwill, business opportunities, or other intangible losses resulting from:</p>
        <ul>
          <li>Your access to or use of (or inability to access or use) this website.</li>
          <li>Any reliance placed on information provided on this website.</li>
          <li>Any errors or omissions in website content.</li>
          <li>Unauthorized access to or alteration of your data.</li>
          <li>Any interruption, suspension, or termination of this website.</li>
          <li>Technical issues, viruses, or malware encountered while accessing this website.</li>
          <li>The conduct of any third party accessible through this website.</li>
        </ul>
        <p>CS Vertex's total liability in any circumstances shall not exceed the amount paid by you for the specific service or product giving rise to the claim. This limitation applies whether the claim is based on warranty, contract, tort, or any other legal theory.</p>
      </section>

      <section id="contact">
        <h2><span>09</span>Contact</h2>
        <p>If you have any questions, concerns, or feedback regarding this Disclaimer or any content on the CS Vertex website, please contact us:</p>
        <p><a href="mailto:hello@csvertex.com">hello@csvertex.com</a></p>
        <p>CS Vertex reserves the right to update this Disclaimer at any time without prior notice. Continued use of this website following any changes constitutes your acceptance of the revised Disclaimer.</p>
      </section>

    </LegalPageLayout>
  )
}
