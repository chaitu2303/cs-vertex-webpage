import React from 'react'
import { LegalPageLayout } from '@/components/LegalPageLayout'

export default function RefundPolicyPage() {
  const sections = [
    { id: 'overview',            title: '1. Overview' },
    { id: 'non-refundable',      title: '2. Non-Refundable Services' },
    { id: 'custom-development',  title: '3. Custom Software & Design' },
    { id: 'third-party',         title: '4. Third-Party & Infrastructure' },
    { id: 'learning-platform',   title: '5. Learning Platform Refunds' },
    { id: 'approved-refunds',    title: '6. Approved Refund Process' },
    { id: 'cancellation',        title: '7. Project Cancellation' },
    { id: 'disputes',            title: '8. Disputes & Contact' },
  ]

  return (
    <LegalPageLayout title="Refund Policy" lastUpdated="June 2026" sections={sections}>

      <section id="overview">
        <h2><span>01</span>Overview</h2>
        <p>CS Vertex is committed to delivering high-quality technology solutions and services to every client. We take pride in the work we do and strive to meet and exceed client expectations at every stage of a project. This Refund Policy outlines the conditions under which refunds may or may not be issued for services rendered by CS Vertex.</p>
        <p>Due to the custom, time-intensive, and resource-driven nature of software development, design, and technology services, refunds are evaluated on a case-by-case basis. Clients are encouraged to communicate any concerns during the project rather than after completion, so that we can address issues promptly and collaboratively.</p>
        <p>By engaging CS Vertex for any service, you acknowledge and agree to the terms outlined in this Refund Policy.</p>
      </section>

      <section id="non-refundable">
        <h2><span>02</span>Non-Refundable Services</h2>
        <p>The following services and payments are generally non-refundable once work has commenced or services have been activated:</p>
        <ul>
          <li><strong>Custom Software Development:</strong> Any development work including web applications, backend systems, APIs, mobile applications, admin dashboards, ERP, CRM, and SaaS platforms.</li>
          <li><strong>UI/UX Design Services:</strong> Wireframing, prototyping, interface design, brand identity, and creative assets once design phases have been initiated.</li>
          <li><strong>Consultation & Discovery Fees:</strong> Technical consultations, requirement analysis sessions, system architecture planning, and discovery workshops.</li>
          <li><strong>Domain Registration:</strong> Once registered, domain fees are non-refundable as they are purchased from domain registrars and cannot be reversed.</li>
          <li><strong>Web Hosting & Cloud Services:</strong> Hosting fees, server provisioning, and cloud infrastructure charges that have been set up and activated.</li>
          <li><strong>SSL Certificates:</strong> Once issued, SSL certificate fees are non-refundable.</li>
          <li><strong>SMS Gateway & Communication Services:</strong> Credits purchased for SMS, OTP, or notification services that have been provisioned.</li>
          <li><strong>Payment Gateway Setup:</strong> Integration fees and setup charges for payment processing platforms.</li>
          <li><strong>Premium API Subscriptions:</strong> Third-party API access charges, licenses, and subscription fees that have been activated on the client's behalf.</li>
          <li><strong>Digital Products:</strong> Once delivered and accessed, digital products including templates, scripts, and downloadable assets are non-refundable.</li>
          <li><strong>Third-Party Software Licenses:</strong> Licenses procured for plugins, tools, libraries, or software platforms on behalf of clients.</li>
        </ul>
        <p>These services involve direct labour, third-party costs, and resource allocation that cannot be recovered once initiated. CS Vertex does not profit from third-party service charges and passes them through at cost or with transparent markup as agreed.</p>
      </section>

      <section id="custom-development">
        <h2><span>03</span>Custom Software & Design</h2>
        <p>Custom software development and design services are highly personalized and labour-intensive. Once a project commences and development or design work has begun, the associated advance payment and milestone payments are non-refundable, as they compensate for the time, expertise, and resources already allocated to your project.</p>
        <p>If a client is dissatisfied with the work delivered, CS Vertex commits to reviewing the concerns in good faith. Where deliverables do not meet the agreed specifications documented in the project proposal or Statement of Work (SOW), CS Vertex will work to revise and correct the work within the agreed revision scope at no additional cost.</p>
        <p>Refunds will not be issued for subjective preferences, change of mind, or requirements that were not included in the original agreed scope. Any dissatisfaction should be communicated within the project review period, typically 7 days from the delivery of each milestone.</p>
      </section>

      <section id="third-party">
        <h2><span>04</span>Third-Party & Infrastructure Charges</h2>
        <p>Many projects require third-party services, cloud infrastructure, APIs, or licensed software. CS Vertex procures these services on behalf of clients when specified in the project agreement. Once these services have been purchased, activated, or provisioned, their associated costs are non-refundable regardless of whether the project continues.</p>
        <p>Clients are responsible for understanding that third-party services operate under their own terms and pricing policies. CS Vertex cannot guarantee refunds from third-party providers and will not absorb third-party costs in the event of project cancellation after these services have been activated.</p>
        <p>Where possible, CS Vertex will advise clients before purchasing third-party services and will seek written confirmation before proceeding with any significant third-party expenditure on a client's behalf.</p>
      </section>

      <section id="learning-platform">
        <h2><span>05</span>Learning Platform Refunds</h2>
        <p>CS Vertex's Learning Platform offers internships, courses, and workshops designed to provide practical technology education. The following refund terms apply specifically to learning programs:</p>
        <ul>
          <li><strong>Internship Programs:</strong> Registration fees are non-refundable once the internship batch has commenced. Requests submitted at least 7 days before the program start date may be considered for partial refund or transfer to a future batch.</li>
          <li><strong>Online Courses:</strong> Course fees are non-refundable once access has been granted to the course materials, recorded sessions, or live classes.</li>
          <li><strong>Workshops:</strong> Workshop registration fees are non-refundable after the workshop date. Transfers to future workshop batches may be arranged with at least 48 hours' notice, subject to availability.</li>
          <li><strong>Bootcamps:</strong> Bootcamp fees follow the milestone payment structure. Fees paid for completed phases are non-refundable.</li>
        </ul>
        <p>Schedules, content, and availability of learning programs may change. CS Vertex will make reasonable efforts to notify registered participants of any changes and provide alternative options where possible.</p>
      </section>

      <section id="approved-refunds">
        <h2><span>06</span>Approved Refund Process</h2>
        <p>In circumstances where a refund is approved at the discretion of CS Vertex — such as in cases of significant service failure, billing errors, or exceptional circumstances — the following process applies:</p>
        <ul>
          <li>The client submits a refund request to <a href="mailto:hello@csvertex.com">hello@csvertex.com</a> with relevant details.</li>
          <li>CS Vertex reviews the request within 5–7 business days and communicates the outcome.</li>
          <li>Approved refunds are processed using the original payment method within 10–14 business days.</li>
          <li>Partial refunds may be issued where some work has been completed and accepted.</li>
          <li>CS Vertex reserves the right to deduct any third-party costs, transaction fees, or processing charges from approved refund amounts.</li>
        </ul>
        <p>CS Vertex does not issue refunds as a standard practice for services rendered. Each case is evaluated individually, and the decision of CS Vertex regarding refund eligibility is final.</p>
      </section>

      <section id="cancellation">
        <h2><span>07</span>Project Cancellation</h2>
        <p>If a client wishes to cancel a project after commencement, they must notify CS Vertex in writing via email to <a href="mailto:hello@csvertex.com">hello@csvertex.com</a>. The following terms apply upon cancellation:</p>
        <ul>
          <li>All work completed up to the cancellation date is billable and non-refundable.</li>
          <li>If the advance payment does not cover the work already completed, the client may be invoiced for the outstanding balance.</li>
          <li>Any third-party services activated or procured before cancellation remain the client's financial responsibility.</li>
          <li>CS Vertex will deliver all completed work and assets to the client upon settlement of any outstanding payments.</li>
          <li>Source code and project files will only be transferred after all outstanding dues are cleared in full.</li>
        </ul>
        <p>Project cancellation does not exempt clients from obligations already incurred. CS Vertex will work constructively to reach a fair resolution in all cancellation scenarios.</p>
      </section>

      <section id="disputes">
        <h2><span>08</span>Disputes & Contact</h2>
        <p>If you believe there has been a billing error, a failure to deliver agreed services, or have a genuine dispute regarding payments, please contact the CS Vertex team as soon as possible. Early communication allows us to resolve concerns efficiently and professionally.</p>
        <p>For all refund requests and billing disputes, contact us at:</p>
        <p><a href="mailto:hello@csvertex.com">hello@csvertex.com</a></p>
        <p>CS Vertex is committed to resolving disputes fairly and transparently. We believe in long-term client relationships built on trust, and we take all concerns seriously. Where disputes cannot be resolved through direct communication, they will be subject to the governing law applicable in our jurisdiction.</p>
        <p>We encourage clients to raise concerns promptly. Disputes raised more than 30 days after project completion or payment may be more difficult to resolve and may not qualify for refund consideration.</p>
      </section>

    </LegalPageLayout>
  )
}
