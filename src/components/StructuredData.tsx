"use client"

export function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "CS Vertex",
    "url": "https://csvertex.com",
    "logo": "https://csvertex.com/assets/logo/csvertex-logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-72889-77131",
      "contactType": "customer service",
      "email": "hello@csvertex.com",
      "availableLanguage": ["English", "Hindi"]
    },
    "sameAs": [
      "https://www.linkedin.com/company/cs-vertex/",
      "https://www.instagram.com/cs_vertex"
    ]
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
