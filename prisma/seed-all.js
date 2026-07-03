const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // 1. Clear existing database records to prevent duplicate key errors
  console.log("Clearing existing services, projects, and team members...");
  await prisma.service.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.teamMember.deleteMany({});

  // 2. Seed Team Members with CORRECT image file paths
  const team = [
    {
      name: 'Chaitanya Kumar Sahu',
      role: 'Founder & CEO',
      expertise: 'Full Stack Development, Artificial Intelligence (AI), Machine Learning (ML), Python, Java, Web Development, Cybersecurity, Automation, Startup Leadership, Product Strategy, Project Management',
      email: 'chaitanyakumarsahu00@gmail.com',
      linkedinUrl: 'https://www.linkedin.com/in/chaitanya-kumar-sahu/',
      githubUrl: 'https://github.com/chaitu2303',
      bio: "Leading CS Vertex's vision, business strategy, enterprise software engineering, AI innovation, cybersecurity solutions, and next-generation technology products. Passionate about building scalable software, intelligent automation systems, and innovative digital solutions that empower businesses and startups worldwide.",
      image: '/assets/team/founder_chaitanya.jpg',
      order: 1
    },
    {
      name: 'Nithish Kumar Darimisetty',
      role: 'Head of Product Engineering & AI',
      expertise: 'Artificial Intelligence (AI), Machine Learning (ML), Java, Python, Web Development, Data Science, Product Engineering, Backend Architecture, Quantum Computing, Research & Innovation',
      email: 'nithishkumardarimisetty@gmail.com',
      linkedinUrl: 'https://www.linkedin.com/in/nithish-kumar-darimisetty-37249134a/',
      githubUrl: 'https://github.com/nithishkumar616',
      bio: 'Leading advanced software engineering initiatives with expertise in Artificial Intelligence, Machine Learning, Data Science, Product Architecture, Quantum Computing, and scalable enterprise solutions. Focused on building intelligent software systems that combine innovation, performance, and reliability.',
      image: '/assets/team/founder_nithish.jpeg',
      order: 2
    },
    {
      name: 'Gopi Vasant Kumar',
      role: 'Technical Lead',
      expertise: 'Artificial Intelligence (AI), Machine Learning (ML), Java, Python, Web Development, Backend Development, React.js, Node.js, Database Management, DevOps, Cloud Deployment, Software Architecture',
      email: 'vasanth18092005@gmail.com',
      linkedinUrl: 'https://www.linkedin.com/in/vasant-kumar-gopi-020a20319/',
      githubUrl: 'https://github.com/vasantgopi',
      bio: 'Driving software architecture, backend engineering, scalable APIs, DevOps integration, cloud-native solutions, and full-stack application development across enterprise-grade projects while ensuring performance, scalability, and maintainability.',
      image: '/assets/team/founder_vasant.jpeg',
      order: 3
    },
    {
      name: 'Barru Harish',
      role: 'Creative Director',
      expertise: 'UI/UX Design, Artificial Intelligence (AI), Machine Learning (ML), Python, Java, Web Development, Figma, Motion Design, Graphic Design, Creative Direction',
      email: 'bharish1214@gmail.com',
      linkedinUrl: 'https://www.linkedin.com/in/b-harish-058ab7283/',
      githubUrl: 'https://github.com/BarruHarish',
      bio: 'Creating premium digital experiences through modern UI/UX design, motion graphics, creative strategy, and visual storytelling. Focused on delivering elegant, user-centric interfaces that strengthen the CS Vertex brand.',
      image: '/assets/team/founder_harish.jpeg',
      order: 4
    },
    {
      name: 'Kalla Mahendra Nadh',
      role: 'Embedded Systems & IoT Lead',
      expertise: 'Artificial Intelligence (AI), Machine Learning (ML), Python, Java, Computer Networking, Embedded C, Arduino, ESP32, Raspberry Pi, Internet of Things (IoT), Robotics, Firmware Development',
      email: 'mahendranadha46@gmail.com',
      linkedinUrl: 'https://www.linkedin.com/in/mahendra-n-bb23b9306/',
      githubUrl: null,
      bio: 'Building intelligent embedded systems, IoT platforms, firmware solutions, robotics integrations, networking solutions, and hardware-software ecosystems that power next-generation smart technologies.',
      image: '/assets/team/founder_mahendra.jpg',
      order: 5
    },
    {
      name: 'Gunna Sateesh',
      role: 'Operations Coordinator',
      expertise: 'Operations Management, Project Management, Client Coordination, Documentation, Quality Assurance (QA), Artificial Intelligence (AI), Machine Learning (ML), Java, Python, Web Development, Process Management',
      email: 'sateeshgunna09@gmail.com',
      linkedinUrl: 'https://www.linkedin.com/in/sateesh-gunna-33948534a/',
      githubUrl: null,
      bio: 'Managing organizational operations, project execution, client communication, workflow optimization, documentation, and quality assurance while ensuring efficient collaboration across engineering and business teams.',
      image: '/assets/team/founder_sateesh2.jpeg',
      order: 6
    }
  ];

  console.log("Seeding team members...");
  for (const member of team) {
    await prisma.teamMember.create({ data: member });
  }

  // 3. Seed Projects with CORRECT image file paths
  const projects = [
    {
      title: 'DESH Property',
      category: 'Software',
      shortSummary: 'Real Estate Management Platform',
      challenge: 'Managing scattered real estate listings and fragmented customer interactions.',
      solution: 'A unified enterprise web platform for property management.',
      technologies: 'Next.js, Node.js, PostgreSQL',
      impact: 'Streamlined operations for 50+ real estate agents.',
      image: '/assets/projects/deshproperty.png',
      order: 1
    },
    {
      title: 'Food Chain',
      category: 'Software',
      shortSummary: 'Supply Chain Tracking for F&B',
      challenge: 'Lack of transparency in food supply chain logistics.',
      solution: 'Blockchain-inspired ledger for tracking food from farm to table.',
      technologies: 'React, Express, MongoDB',
      impact: 'Reduced spoilage by 20% through real-time tracking.',
      image: '/assets/projects/foodchain.png',
      order: 2
    },
    {
      title: 'Smart LPG',
      category: 'IoT',
      shortSummary: 'IoT Gas Leakage & Level Monitor',
      challenge: 'Undetected gas leaks causing hazards and unexpected empty cylinders.',
      solution: 'An embedded sensor system that monitors gas levels and detects leaks.',
      technologies: 'ESP32, MQ6 Sensor, AWS IoT',
      impact: 'Prevented hazardous incidents and automated refill alerts.',
      image: '/assets/projects/project-lpg.jpg',
      order: 3
    },
    {
      title: 'Smart Gloves',
      category: 'Hardware',
      shortSummary: 'Gesture Translation Gloves',
      challenge: 'Communication barrier for sign language users.',
      solution: 'Gloves equipped with flex sensors that translate gestures into text/speech.',
      technologies: 'Arduino, Flex Sensors, Bluetooth',
      impact: 'Enabled real-time communication for deaf-mute individuals.',
      image: '/assets/projects/project-gloves.jpg',
      order: 4
    },
    {
      title: 'Smart Guest Introduction',
      category: 'Robotics',
      shortSummary: 'Automated Receptionist Robot',
      challenge: 'High cost of human receptionists in large corporate events.',
      solution: 'A robotic system that greets, registers, and directs guests.',
      technologies: 'Raspberry Pi, Python, Computer Vision',
      impact: 'Handled 500+ guests seamlessly during corporate tech events.',
      image: '/assets/projects/project-guest.jpg',
      order: 5
    },
    {
      title: 'Smart Glasses',
      category: 'Hardware',
      shortSummary: 'Assistive Glasses for the Visually Impaired',
      challenge: 'Navigational difficulties for visually impaired individuals.',
      solution: 'Glasses with ultrasonic sensors to detect obstacles and provide audio feedback.',
      technologies: 'Arduino Nano, Ultrasonic Sensors, Buzzer',
      impact: 'Improved mobility and independence for visually impaired users.',
      image: '/assets/projects/project-glasses-face.jpg',
      order: 6
    },
    {
      title: 'Fire Fighting Robot',
      category: 'Robotics',
      shortSummary: 'Autonomous Fire Detection & Extinguishing',
      challenge: 'Risk to human lives in early-stage fire containment.',
      solution: 'A mobile robot that autonomously navigates to and extinguishes flames.',
      technologies: 'Arduino, Flame Sensors, Water Pump',
      impact: 'Successfully contained simulated Class A fires in under 2 minutes.',
      image: '/assets/projects/project-robot-fire.jpg',
      order: 7
    },
    {
      title: 'Obstacle Avoiding Robot',
      category: 'Robotics',
      shortSummary: 'Autonomous Navigation Vehicle',
      challenge: 'Need for reliable autonomous pathfinding in dynamic environments.',
      solution: 'A mobile chassis utilizing sonar and infrared to navigate around obstacles.',
      technologies: 'ESP8266, Ultrasonic Sensors, Motor Drivers',
      impact: 'Provided a foundation for factory-floor automated guided vehicles (AGVs).',
      image: '/assets/projects/project-robot-obstacle.jpg',
      order: 8
    }
  ];

  console.log("Seeding projects...");
  for (const project of projects) {
    await prisma.project.create({ data: project });
  }

  // 4. Seed Services
  const services = [
    {
      title: "Software Development",
      description: "Custom web platforms and enterprise software that streamline workflows.",
      businessValue: "Increased efficiency, reduced operational overhead, scalable digital infrastructure.",
      icon: "Laptop",
      order: 1
    },
    {
      title: "AI Solutions",
      description: "Intelligent systems and machine learning models.",
      businessValue: "Enhanced decision-making, predictive analytics, and unlocking new revenue streams through data.",
      icon: "Brain",
      order: 2
    },
    {
      title: "Embedded Systems",
      description: "Robust hardware and firmware engineering.",
      businessValue: "Dependable edge processing for demanding physical environments and specialized industrial applications.",
      icon: "Cpu",
      order: 3
    },
    {
      title: "IoT Solutions",
      description: "Comprehensive Internet of Things ecosystems.",
      businessValue: "Real-time visibility, remote asset management, and telemetry-driven operational control.",
      icon: "Cloud",
      order: 4
    },
    {
      title: "Robotics Engineering",
      description: "Advanced robotic control systems and autonomous navigation.",
      businessValue: "Automating complex, repetitive, or hazardous physical tasks safely and efficiently.",
      icon: "Bot",
      order: 5
    },
    {
      title: "Enterprise Applications",
      description: "Secure, high-availability platforms unifying business data.",
      businessValue: "Modernization of legacy systems, orchestrated business logic, and unified team workflows.",
      icon: "Layers",
      order: 6
    },
    {
      title: "Automation Systems",
      description: "End-to-end industrial and software automation.",
      businessValue: "Elimination of bottlenecks by integrating disparate systems into cohesive, autonomous workflows.",
      icon: "Workflow",
      order: 7
    }
  ];

  console.log("Seeding services...");
  for (const service of services) {
    await prisma.service.create({ data: service });
  }

  console.log("Database seeded successfully with original CS Vertex content!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
