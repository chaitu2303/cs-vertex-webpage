"use client"

export function AnnouncementBanner({ announcement }: { announcement?: any }) {
  if (!announcement) {
    return (
      <div style={{ background: '#111', borderRadius: '16px', border: '1px solid #333', display: 'flex', overflow: 'hidden' }}>
        <div style={{ flex: 1, background: 'url(/assets/vertex-hero.png) center/cover', minHeight: '300px' }}></div>
        <div style={{ flex: 1, padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ color: 'var(--acid)', fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '15px' }}>Current Announcement</span>
          <h3 style={{ fontSize: '36px', margin: '0 0 20px', lineHeight: 1.2 }}>🚀 Welcome to CS Vertex</h3>
          <p style={{ color: '#888', fontSize: '16px', lineHeight: 1.6, marginBottom: '30px' }}>
            We build enterprise software, AI solutions, robotics, embedded systems and scalable digital platforms. Start your project with us today.
          </p>
          <a href="#quote" className="primary-action" style={{ width: 'fit-content' }}>
            <span>Request Quote</span><b>↗</b>
          </a>
        </div>
      </div>
    )
  }

  // Admin dynamic version
  return (
    <div style={{ background: '#111', borderRadius: '16px', border: '1px solid #333', display: 'flex', overflow: 'hidden', flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 300px', background: announcement.fileUrl ? `url(${announcement.fileUrl}) center/cover` : '#222', minHeight: '300px' }}></div>
      <div style={{ flex: '2 1 400px', padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <span style={{ color: 'var(--acid)', fontWeight: 'bold', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '15px' }}>{announcement.category}</span>
        <h3 style={{ fontSize: '36px', margin: '0 0 20px', lineHeight: 1.2 }}>{announcement.title}</h3>
        <p style={{ color: '#888', fontSize: '16px', lineHeight: 1.6, marginBottom: '30px' }}>
          {announcement.content}
        </p>
        <a href="#quote" className="primary-action" style={{ width: 'fit-content' }}>
          <span>Explore Now</span><b>↗</b>
        </a>
      </div>
    </div>
  )
}
