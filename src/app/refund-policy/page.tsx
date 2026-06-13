import React from 'react'
import { LegalPageLayout } from '@/components/LegalPageLayout'

export default function RefundPolicy() {
  return (
    <LegalPageLayout title="Refund Policy" lastUpdated="June 12, 2026">
      <h2>1. Custom Software & Hardware Engineering</h2>
      <p>Due to the custom nature of our enterprise engineering solutions, payments made for project milestones, development sprints, and hardware prototyping are non-refundable once work has commenced.</p>

      <h2>2. Consulting & Retainers</h2>
      <p>Technical consulting fees and monthly development retainers are billed in advance. If you choose to terminate a consulting agreement, you will not be refunded for the current billing cycle, but no further charges will be applied.</p>

      <h2>3. Digital Products & Courses</h2>
      <p>For standalone digital products, pre-recorded courses, or digital assets purchased through our platform, refunds may be requested within 7 days of purchase, provided that the content has not been substantially consumed or downloaded.</p>

      <h2>4. Dispute Resolution</h2>
      <p>If you believe there has been an error in billing or a failure to deliver the agreed-upon scope of work, please contact your assigned Project Manager or reach out to billing@csvertex.com to initiate a review.</p>
    </LegalPageLayout>
  )
}
