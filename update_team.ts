import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const teamData = [
  {
    name: "Chaitanya Kumar Sahu",
    role: "Founder & CEO",
    bio: "Leading CS Vertex's vision, business strategy, enterprise software development, cybersecurity initiatives, and digital transformation programs. Passionate about building scalable technology solutions that bridge innovation with real-world business impact.",
    expertise: ["Full Stack Development", "Cyber Security & VAPT", "Python Development", "Java Development", "Product Strategy", "Enterprise Software Architecture"]
  },
  {
    name: "Gopi Vasant Kumar",
    role: "Technical Lead",
    bio: "Driving software architecture, backend engineering, and full-stack application development across enterprise platforms. Strong expertise in designing scalable systems, APIs, cloud-integrated applications, and modern web technologies.",
    expertise: ["Full Stack Development", "Backend Engineering", "Python Development", "Java Development", "API Design & Integration", "System Architecture"]
  },
  {
    name: "Nithish Kumar Darimisetty",
    role: "Product Engineering Lead",
    bio: "Leading advanced product engineering initiatives with expertise in AI/ML, Data Science, Quantum Computing concepts, backend technologies, and technical mentoring. Known for analytical thinking, problem-solving, and building intelligent systems.",
    expertise: ["Artificial Intelligence & Machine Learning", "Data Science & Analytics", "Quantum Computing Concepts", "Python Development", "Backend Engineering", "Technical Training & Mentorship"]
  },
  {
    name: "KALLA MAHENDRA NADHA", // using the user's previously preferred spelling or let's use the one in prompt: "Kalla Mahendra Nadh"
    role: "Robotics, Embedded Systems & IoT Lead",
    bio: "Specializing in robotics engineering, embedded systems, IoT architectures, AI/ML applications, and intelligent automation. Focused on developing next-generation hardware and connected technology solutions.",
    expertise: ["Robotics Engineering", "Embedded Systems", "IoT Solutions", "Artificial Intelligence & Machine Learning", "Python Development", "Java Development"]
  },
  {
    name: "Gunna Sateesh",
    role: "Operations Coordinator",
    bio: "Managing operational excellence, project coordination, client communication, and financial workflow planning. Supports technology teams through efficient execution, resource coordination, and business process management.",
    expertise: ["Operations Management", "Project Coordination", "Financial Planning & Analysis", "Client Relationship Management", "Web Development", "Process Optimization"]
  },
  {
    name: "Barru Harish",
    role: "Executive Director & Design Lead",
    bio: "Leading design strategy, product innovation, user experience architecture, and brand development while contributing to software engineering initiatives and digital transformation projects.",
    expertise: ["UI/UX Design", "Product Design", "Design Systems", "Brand Identity", "Frontend Development", "Python Development", "Java Development", "User Experience Strategy"]
  }
];

async function main() {
  // First, get all existing team members to match them up, or just clear and recreate them
  // Actually, wait, there might be images linked to them in the DB.
  // The user prompt spells "Kalla Mahendra Nadh". In previous overrides it was "KALLA MAHENDRA NADHA".
  // Let's match by partial name
  const existing = await prisma.teamMember.findMany();
  
  for (const t of teamData) {
    let match = existing.find(e => e.name.toLowerCase().includes(t.name.split(' ')[0].toLowerCase()));
    
    // special matching
    if (t.name.includes("Kalla") || t.name.includes("Mahendra")) {
      match = existing.find(e => e.name.toLowerCase().includes("mahendra"));
    }
    if (t.name.includes("Gopi")) {
      match = existing.find(e => e.name.toLowerCase().includes("gopi"));
    }
    if (t.name.includes("Gunna")) {
      match = existing.find(e => e.name.toLowerCase().includes("sateesh") || e.name.toLowerCase().includes("gunna"));
    }
    if (t.name.includes("Barru")) {
      match = existing.find(e => e.name.toLowerCase().includes("harish"));
    }

    if (match) {
      await prisma.teamMember.update({
        where: { id: match.id },
        data: {
          name: t.name,
          role: t.role,
          bio: t.bio,
          expertise: t.expertise.join(', '),
          order: teamData.indexOf(t)
        }
      });
      console.log(`Updated ${t.name}`);
    } else {
      // Create new
      await prisma.teamMember.create({
        data: {
          name: t.name,
          role: t.role,
          bio: t.bio,
          expertise: t.expertise.join(', '),
          image: '/assets/team/placeholder.jpg',
          published: true,
          order: teamData.indexOf(t)
        }
      });
      console.log(`Created ${t.name}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
