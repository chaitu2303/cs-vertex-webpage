import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const team = [
  {
    name: 'Chaitanya Kumar Sahu',
    role: 'Founder & CEO',
    bio: 'Founder of CS Vertex, leading software engineering, AI innovation, cybersecurity, and enterprise digital transformation initiatives. Passionate about building scalable technology solutions for startups, educational institutions, and businesses.',
    expertise: 'Full Stack Development, App Development, Web Development, Artificial Intelligence, Machine Learning, Java, Python, React, Node.js, Cybersecurity, Startup Leadership, Product Strategy',
    image: '/assets/team/founder_chaitanya.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/chaitanya-kumar-sahu',
    githubUrl: 'https://github.com/chaitu2303',
    email: 'chaitanyakumarsahu00@gmail.com',
    portfolioUrl: 'https://chaitanya-kumar-sahu-portifolio.netlify.app',
    order: 1
  },
  {
    name: 'Gopi Vasant Kumar',
    role: 'Product Engineering Lead',
    bio: 'Leads product engineering, frontend architecture, scalable software systems, AI integration, and user-focused enterprise applications while ensuring high-quality product delivery.',
    expertise: 'Backend Development, React, Node.js, Java, Python, AI / ML, Cloud Computing, Databases, DevOps, Web Development',
    image: '/assets/team/founder_vasant_v2.jpeg',
    linkedinUrl: 'https://www.linkedin.com/in/vasant-kumar-gopi-020a20319/',
    githubUrl: 'https://github.com/vasantgopi',
    email: 'vasanth18092005@gmail.com',
    portfolioUrl: null,
    order: 2
  },
  {
    name: 'Nithish Kumar Darimisetty',
    role: 'Technical Lead',
    bio: 'Responsible for software architecture, backend systems, APIs, cloud infrastructure, performance optimization, and enterprise application development.',
    expertise: 'AI / ML, Java, Python, React, Web Development, REST APIs, Product Design, Quantum Computing',
    image: '/assets/team/founder_nithish.jpeg',
    linkedinUrl: 'https://www.linkedin.com/in/nithish-kumar-darimisetty-37249134a/',
    githubUrl: 'https://github.com/nithishkumar616',
    email: 'darimisettynithishkumar@gmail.com',
    portfolioUrl: null,
    order: 3
  },
  {
    name: 'Barru Harish',
    role: 'Executive Director',
    bio: 'Leads creative strategy, branding, UI/UX innovation, design systems, and digital experiences across CS Vertex products.',
    expertise: 'UI / UX Design, Graphic Design, Motion Design, Branding, Figma, Java, Python, AI / ML, Web Development',
    image: '/assets/team/founder_harish.jpeg',
    linkedinUrl: 'https://www.linkedin.com/in/barru-harish-058ab7283/',
    githubUrl: 'https://github.com/BarruHarish',
    email: 'bharish1214@gmail.com',
    portfolioUrl: null,
    order: 4
  },
  {
    name: 'Kalla Mahendra Nadha',
    role: 'Robotics, Embedded Systems & IoT Lead',
    bio: 'Specializes in embedded systems, robotics, automation, IoT architecture, AI-powered hardware solutions, and intelligent industrial systems.',
    expertise: 'Embedded C, Arduino, ESP32, Raspberry Pi, Robotics, IoT, Python, Java, AI / ML, Web Development',
    image: '/assets/team/founder_mahendra.jpg',
    linkedinUrl: 'https://www.linkedin.com/in/mahendra-n-bb23b9306/',
    githubUrl: null,
    email: 'mahendranadha46@gmail.com',
    portfolioUrl: null,
    order: 5
  },
  {
    name: 'Gunna Sateesh',
    role: 'Operations Coordinator',
    bio: 'Coordinates business operations, client communication, project execution, documentation, and delivery management to ensure smooth workflow across all CS Vertex projects.',
    expertise: 'Operations Management, Project Coordination, Client Relationship Management, Java, Python, Web Development',
    image: '/assets/team/founder_sateesh2.jpeg',
    linkedinUrl: 'https://www.linkedin.com/in/sateesh-gunna-33948534a',
    githubUrl: 'https://github.com/sateeshg09',
    email: 'sateeshgunna09@gmail.com',
    portfolioUrl: null,
    order: 6
  }
]

async function main() {
  console.log("Wiping existing team...")
  await prisma.teamMember.deleteMany({})

  console.log("Creating new team...")
  for (const member of team) {
    await prisma.teamMember.create({
      data: {
        ...member,
        published: true
      }
    })
    console.log(`Created ${member.name}`)
  }
  console.log("Team successfully updated.")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
