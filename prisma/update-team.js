const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Clear team members
  await prisma.teamMember.deleteMany({});
  
  // Seed team members in order
  const team = [
    {
      name: 'Chaitanya Kumar Sahu',
      role: 'Founder & CEO',
      expertise: 'Web Development (Full Stack), Cyber Security, Python Full Stack, and Java.',
      email: 'chaitanyakumarsahu00@gmail.com',
      linkedinUrl: 'https://www.linkedin.com/in/chaitanya-kumar-sahu/',
      bio: 'Leading CS Vertex vision, enterprise software strategy, and digital transformation. Expert in full-stack web development, Python applications, Java engineering, and cyber security architectures.',
      image: '/assets/team/founder_chaitanya.jpg',
      order: 1
    },
    {
      name: 'Nithish Kumar Darimisetty',
      role: 'Product Engineering Lead',
      expertise: 'Full-stack development, cloud architecture, system automation, and product lifecycle engineering.',
      email: 'nithishkumardarimisetty@gmail.com',
      linkedinUrl: 'https://www.linkedin.com/in/nithish-kumar-darimisetty-37249134a/',
      bio: 'Architecting scalable platforms, product engineering frameworks, automation systems, and technical innovation.',
      image: '/assets/team/founder_nithish.jpeg',
      order: 2
    },
    {
      name: 'Gopi Vasant Kumar',
      role: 'Technical Lead',
      expertise: 'Scalable backend systems development, database optimization, API integration, and cloud architecture.',
      email: 'vasanth18092005@gmail.com',
      linkedinUrl: 'https://www.linkedin.com/in/vasant-kumar-gopi-020a20319/',
      bio: 'Driving scalable software architecture, cloud technologies, backend systems, and technical execution.',
      image: '/assets/team/founder_vasant.jpeg',
      order: 3
    },
    {
      name: 'Barru Harish',
      role: 'Executive Director',
      expertise: 'High-fidelity UI/UX design, corporate branding, product prototyping, and visual identity systems.',
      email: 'bharish1214@gmail.com',
      linkedinUrl: 'https://www.linkedin.com/in/b-harish-058ab7283/',
      bio: 'Leading product design, UI/UX innovation, branding systems, visual storytelling, and customer experience design.',
      image: '/assets/team/founder_harish.png',
      order: 4
    },
    {
      name: 'Kalla Mahendra Nadh',
      role: 'Robotics, Embedded Systems & IoT Lead',
      expertise: 'ESP32 firmware engineering, custom PCB design, robotics hardware design, and smart IoT automation.',
      email: 'mahendranadha46@gmail.com',
      linkedinUrl: 'https://www.linkedin.com/in/mahendra-n-bb23b9306/',
      bio: 'Specializing in robotics engineering, embedded systems development, IoT architectures, automation hardware, and intelligent device integration.',
      image: '/assets/team/founder_mahendra.jpg',
      order: 5
    },
    {
      name: 'Gunna Sateesh',
      role: 'Operations Coordinator',
      expertise: 'Agile project management, operational workflow coordination, client relations, and delivery execution.',
      email: 'sateeshgunna09@gmail.com',
      linkedinUrl: 'https://www.linkedin.com/in/sateesh-gunna-33948534a/',
      bio: 'Managing project coordination, operational workflows, client communication, and delivery management.',
      image: '/assets/team/founder_sateesh.webp',
      order: 6
    }
  ];

  for (const member of team) {
    await prisma.teamMember.create({ data: member });
  }
  console.log('Successfully re-seeded team members in exact order.');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
