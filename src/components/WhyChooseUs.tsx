import { Zap, Bot, Shield, RefreshCw, TrendingUp, Handshake, Rocket, Settings } from 'lucide-react'

export function WhyChooseUs() {
  const points = [
    { title: 'Software + Hardware Expertise', desc: 'Full-stack software engineering combined with custom embedded hardware design under one roof.', icon: <Zap size={32} strokeWidth={1.5} className="hover-orange-icon" /> },
    { title: 'AI, Automation & Robotics', desc: 'Integrating advanced machine learning and physical robotics to solve complex industry bottlenecks.', icon: <Bot size={32} strokeWidth={1.5} className="hover-orange-icon" /> },
    { title: 'Enterprise-grade Standards', desc: 'Rigorous testing, scalable architecture, and strict security protocols for mission-critical deployments.', icon: <Shield size={32} strokeWidth={1.5} className="hover-orange-icon" /> },
    { title: 'End-to-End Development', desc: 'From initial prototype to global cloud infrastructure, we handle the complete product lifecycle.', icon: <RefreshCw size={32} strokeWidth={1.5} className="hover-orange-icon" /> },
    { title: 'Startup to Enterprise Scalability', desc: 'Systems architected to grow seamlessly with your business demands without technical debt.', icon: <TrendingUp size={32} strokeWidth={1.5} className="hover-orange-icon" /> },
    { title: 'Transparent Collaboration', desc: 'Direct access to your engineering team, regular sprint reviews, and full project visibility.', icon: <Handshake size={32} strokeWidth={1.5} className="hover-orange-icon" /> },
    { title: 'Future-ready Tech Stack', desc: 'Leveraging Next.js, Rust, Python AI, and modern cloud ecosystems for unmatched performance.', icon: <Rocket size={32} strokeWidth={1.5} className="hover-orange-icon" /> },
    { title: 'Long-term Support', desc: 'Dedicated maintenance, SLA-backed uptime, and continuous feature integration post-launch.', icon: <Settings size={32} strokeWidth={1.5} className="hover-orange-icon" /> }
  ]

  return (
    <div style={{ marginTop: '80px' }}>
      <h3 style={{ fontSize: '14px', color: 'var(--acid)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '40px' }}>
        Why Choose <span style={{ color: '#ffffff' }}>CS Vertex</span>
      </h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {points.map((pt, i) => (
          <div key={i} className="team-card-glass group" style={{ padding: '30px', textAlign: 'left', transitionDelay: `${i * 0.1}s` }}>
            <div style={{ marginBottom: '20px', display: 'flex', color: 'var(--acid)' }}>{pt.icon}</div>
            <h4 style={{ fontSize: '16px', color: '#fff', marginBottom: '10px', lineHeight: 1.4 }}>{pt.title}</h4>
            <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.6, margin: 0 }}>{pt.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
