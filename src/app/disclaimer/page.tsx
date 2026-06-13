import React from 'react'
import { LegalPageLayout } from '@/components/LegalPageLayout'

export default function Disclaimer() {
  return (
    <LegalPageLayout title="Disclaimer" lastUpdated="June 12, 2026">
      <h2>1. General Information Accuracy</h2>
      <p>The information provided by CS Vertex on this website is for general informational purposes only. While we strive to keep the information up-to-date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website.</p>

      <h2>2. Professional Engineering Advice</h2>
      <p>The content on this website does not constitute formal engineering, architectural, or technical advice. Any reliance you place on such information is strictly at your own risk. For specific project consulting, please formally engage our engineering team.</p>

      <h2>3. Third-Party Links</h2>
      <p>Through this website, you may be able to link to other websites which are not under the control of CS Vertex. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.</p>

      <h2>4. Service Interruptions</h2>
      <p>Every effort is made to keep the website up and running smoothly. However, CS Vertex takes no responsibility for, and will not be liable for, the website being temporarily unavailable due to technical issues beyond our control.</p>
    </LegalPageLayout>
  )
}
