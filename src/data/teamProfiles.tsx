/* ─── Types ──────────────────────────────────────────────────────────── */
export type TeamMember = {
  id: string
  name: string
  role: string
  expertise: string | null
  bio: string
  image: string | null
  linkedinUrl: string | null
  githubUrl: string | null
  email: string | null
  portfolioUrl: string | null
}

export type MemberProfile = {
  about: string
  skills: string[]
  focus: string[]
  portfolioUrl?: string
  objectPosition?: string
  objectScale?: number
  stats: { projects: string; exp: string; skills: string; certs: string }
  experience: { role: string; org: string; year: string }[]
  featuredProjects: { name: string; url?: string }[]
}

/* ─── Per-member profile data ────────────────────────────────────────── */
export const PROFILES: Record<string, MemberProfile> = {
  chaitanya: {
    about:
      'Passionate software developer and entrepreneur leading CS Vertex with a vision to build innovative software solutions, AI-powered applications, cybersecurity services, and enterprise technology products. Focused on continuous learning, innovation, and delivering practical digital solutions for startups and businesses.',
    skills: [
      'Full Stack Development', 'Artificial Intelligence', 'Machine Learning',
      'Python', 'Java', 'Web Development', 'Cybersecurity', 'Automation',
      'Startup Leadership', 'Product Strategy', 'Project Management',
    ],
    focus: [
      'Enterprise Software Development', 'AI Products',
      'Cybersecurity Solutions', 'Startup Growth', 'Student Technology Platform',
    ],
    portfolioUrl: 'https://chaitanya-kumar-sahu-portifolio.netlify.app/',
    objectPosition: 'center 0%',
    objectScale: 1.0,
    stats: { projects: '12+', exp: '5+', skills: '8', certs: '15+' },
    experience: [
      { role: 'Founder & CEO', org: 'CS Vertex', year: '2023 - Present' },
      { role: 'Software Engineer', org: 'Tech Innovators', year: '2021 - 2023' }
    ],
    featuredProjects: [
      { name: 'CS Vertex Platform' },
      { name: 'Raksha Alert' },
      { name: 'FoodChain' }
    ]
  },
  nithish: {
    about:
      'Leading advanced software engineering initiatives with expertise in Artificial Intelligence, Machine Learning, Data Science, Product Architecture, and scalable enterprise solutions. Passionate about transforming innovative ideas into intelligent and reliable software products.',
    skills: [
      'AI / ML', 'Java', 'Python', 'Web Development', 'Data Science',
      'Product Engineering', 'Backend Architecture', 'Research & Innovation', 'Quantum Computing',
    ],
    focus: [
      'AI Solutions', 'Product Architecture', 'Research Projects',
      'Machine Learning', 'Enterprise Applications',
      'Student Technology Platform', 'Quantum Computing',
    ],
    objectPosition: 'center 0%',
    objectScale: 1.0,
    stats: { projects: '8+', exp: '4+', skills: '10', certs: '6+' },
    experience: [
      { role: 'Co-Founder & CTO', org: 'CS Vertex', year: '2023 - Present' },
      { role: 'AI Researcher', org: 'AI Labs', year: '2022 - 2023' }
    ],
    featuredProjects: [
      { name: 'AI Analytics Engine' },
      { name: 'NeuralNet Optimizer' }
    ]
  },
  vasant: {
    about:
      'Driving software architecture, backend engineering, scalable APIs, DevOps integration, and full-stack application development across enterprise projects with a focus on performance, reliability, and maintainability.',
    skills: [
      'Backend Development', 'React', 'Node.js', 'Python', 'Java',
      'AI / ML', 'Data Science', 'Databases', 'DevOps', 'Cloud Deployment',
    ],
    focus: [
      'Backend Systems', 'API Development', 'Full Stack Applications',
      'Cloud Deployment', 'Enterprise Software', 'Student Technology Platform',
    ],
    objectPosition: 'center 10%',
    objectScale: 1.0,
    stats: { projects: '15+', exp: '6+', skills: '12', certs: '4+' },
    experience: [
      { role: 'Lead Backend Engineer', org: 'CS Vertex', year: '2023 - Present' },
      { role: 'Cloud Architect', org: 'CloudSys', year: '2021 - 2023' }
    ],
    featuredProjects: [
      { name: 'Scalable Microservices API' },
      { name: 'Data Pipeline Automation' }
    ]
  },
  harish: {
    about:
      'Designing modern UI/UX experiences, intuitive digital interfaces, creative visuals, and engaging product experiences that strengthen the CS Vertex brand across web and digital platforms.',
    skills: [
      'UI / UX Design', 'Graphic Design', 'Motion Design', 'Figma',
      'Creative Direction', 'AI / ML', 'Java', 'Python', 'Web Development',
    ],
    focus: [
      'Product UI Design', 'Design Systems', 'User Experience',
      'Website Design', 'Creative Assets',
    ],
    objectPosition: 'center 15%',
    objectScale: 1.05,
    stats: { projects: '20+', exp: '5+', skills: '7', certs: '8+' },
    experience: [
      { role: 'Creative Director', org: 'CS Vertex', year: '2023 - Present' },
      { role: 'UX Designer', org: 'Design Studio', year: '2020 - 2023' }
    ],
    featuredProjects: [
      { name: 'CS Vertex Rebrand' },
      { name: 'DeshProperty App Design' }
    ]
  },
  mahendra: {
    about:
      'Building intelligent embedded systems, IoT platforms, robotics integrations, and firmware solutions by combining hardware and software to create practical engineering applications.',
    skills: [
      'Embedded C', 'Arduino', 'ESP32', 'Raspberry Pi', 'IoT',
      'Robotics', 'Python', 'Java', 'AI / ML', 'Networking',
    ],
    focus: [
      'Embedded Projects', 'IoT Systems', 'Robotics',
      'Hardware Integration', 'Smart Devices',
    ],
    objectPosition: 'center 15%',
    objectScale: 1.05,
    stats: { projects: '10+', exp: '4+', skills: '9', certs: '3+' },
    experience: [
      { role: 'Embedded Systems Lead', org: 'CS Vertex', year: '2023 - Present' },
      { role: 'IoT Engineer', org: 'Smart Devices Inc.', year: '2021 - 2023' }
    ],
    featuredProjects: [
      { name: 'Smart Home Hub' },
      { name: 'Industrial IoT Sensor' }
    ]
  },
  sateesh: {
    about:
      'Managing operational excellence, project coordination, client communication, financial workflow planning, and execution. Supports software, AI, embedded systems, and enterprise teams through structured planning and business operations.',
    skills: [
      'Operations Management', 'Project Coordination', 'Client Relationship Management',
      'Financial Planning', 'Business Development', 'Process Optimization',
      'Team Coordination', 'Web Development',
    ],
    focus: [
      'Project Coordination', 'Client Communication', 'Documentation',
      'Workflow Management', 'Team Operations',
    ],
    objectPosition: 'center 15%',
    objectScale: 1.25,
    stats: { projects: '30+', exp: '7+', skills: '6', certs: '5+' },
    experience: [
      { role: 'Operations Manager', org: 'CS Vertex', year: '2023 - Present' },
      { role: 'Project Lead', org: 'Enterprise Solutions', year: '2019 - 2023' }
    ],
    featuredProjects: [
      { name: 'Agile Workflow Optimization' },
      { name: 'Client Portal Delivery' }
    ]
  },
}

export function resolveProfile(name: string): MemberProfile {
  const n = name.toLowerCase()
  if (n.includes('chaitanya')) return PROFILES.chaitanya
  if (n.includes('nithish'))   return PROFILES.nithish
  if (n.includes('vasant'))    return PROFILES.vasant
  if (n.includes('harish'))    return PROFILES.harish
  if (n.includes('mahendra'))  return PROFILES.mahendra
  if (n.includes('sateesh') || n.includes('satish')) return PROFILES.sateesh
  return {
    about: '',
    skills: [],
    focus: [],
    objectPosition: 'center top',
    objectScale: 1,
    stats: { projects: '0', exp: '0', skills: '0', certs: '0' },
    experience: [],
    featuredProjects: []
  }
}

export function resolveImage(member: TeamMember): string {
  if (member.image) return member.image
  const n = member.name.toLowerCase()
  if (n.includes('chaitanya')) return '/assets/team/founder_chaitanya.jpg'
  if (n.includes('nithish'))   return '/assets/team/founder_nithish.jpeg'
  if (n.includes('vasant'))    return '/assets/team/founder_vasant.jpeg'
  if (n.includes('harish'))    return '/assets/team/founder_harish.jpeg'
  if (n.includes('mahendra'))  return '/assets/team/founder_mahendra.jpg'
  if (n.includes('sateesh') || n.includes('satish')) return '/assets/team/founder_sateesh2.jpeg'
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=222222&color=ffffff&size=500`
}

export function resolveRoleBadge(role: string): string {
  const r = role.toLowerCase()
  if (r.includes('ceo') || r.includes('founder'))   return 'Founder'
  if (r.includes('product'))  return 'Product'
  if (r.includes('technical') || r.includes('tech')) return 'Engineering'
  if (r.includes('creative'))  return 'Design'
  if (r.includes('embedded') || r.includes('iot'))   return 'Hardware'
  return 'Operations'
}

/* ─── SVG Icons ──────────────────────────────────────────────────────── */
export function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  )
}

export function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  )
}

