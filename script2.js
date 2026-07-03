const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.teamMember.deleteMany();
  const team = [
    {
      name: 'Chaitanya Kumar Sahu',
      role: 'Founder & CEO',
      expertise: 'Full Stack Development, Cyber Security & VAPT, Python Development, Java Development, Product Strategy, Enterprise Software Architecture',
      bio: "Leading CS Vertex's vision, business strategy, enterprise software development, cybersecurity initiatives, and digital transformation programs. Passionate about building scalable technology solutions that bridge innovation with real-world business impact.",
      image: '/assets/team/founder_chaitanya.jpg',
      order: 1
    },
    {
      name: 'Nithish Kumar Darimisetty',
      role: 'Head of Product Engineering & AI',
      expertise: 'Artificial Intelligence & Machine Learning, Data Science & Analytics, Quantum Computing Concepts, Python Development, Backend Engineering, Technical Training & Mentorship',
      bio: 'Leading advanced product engineering initiatives with expertise in AI/ML, Data Science, Quantum Computing concepts, backend technologies, and technical mentoring. Known for analytical thinking, problem-solving, and building intelligent systems.',
      image: '/assets/team/founder_nithish.jpeg',
      order: 2
    },
    {
      name: 'Gopi Vasant Kumar',
      role: 'Technical Lead',
      expertise: 'Full Stack Development, Backend Engineering, Python Development, Java Development, API Design & Integration, System Architecture',
      bio: 'Driving software architecture, backend engineering, and full-stack application development across enterprise platforms. Strong expertise in designing scalable systems, APIs, cloud-integrated applications, and modern web technologies.',
      image: '/assets/team/founder_vasant.jpeg',
      order: 3
    },
    {
      name: 'Barru Harish',
      role: 'Executive Director & Design Lead',
      expertise: 'UI/UX Design, Product Design, Design Systems, Brand Identity, Frontend Development, Python Development, Java Development, User Experience Strategy',
      bio: 'Leading design strategy, product innovation, user experience architecture, and brand development while contributing to software engineering initiatives and digital transformation projects.',
      image: '/assets/team/founder_harish.png',
      order: 4
    },
    {
      name: 'Kalla Mahendra Nadha',
      role: 'Robotics, Embedded Systems & IoT Lead',
      expertise: 'Robotics Engineering, Embedded Systems, IoT Solutions, Artificial Intelligence & Machine Learning, Python Development, Java Development',
      bio: 'Specializing in robotics engineering, embedded systems, IoT architectures, AI/ML applications, and intelligent automation. Focused on developing next-generation hardware and connected technology solutions.',
      image: '/assets/team/founder_mahendra.jpg',
      order: 5
    },
    {
      name: 'Gunna Sateesh',
      role: 'Operations & Business Coordinator',
      expertise: 'Operations Management, Project Coordination, Financial Planning & Analysis, Client Relationship Management, Web Development, Process Optimization',
      bio: 'Managing operational excellence, project coordination, client communication, and financial workflow planning. Supports technology teams through efficient execution, resource coordination, and business process management.',
      image: '/assets/team/founder_sateesh.webp',
      order: 6
    }
  ];

  for (const member of team) {
    await prisma.teamMember.create({ data: member });
  }
  console.log('Team updated successfully');
}

main().finally(() => prisma.$disconnect());
