const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding missing data...');

  // 1. Clear projects and re-seed with exact list
  await prisma.project.deleteMany({});
  
  const projectsData = [
    {
      title: "DeshProperty",
      category: "Software",
      shortSummary: "Modern real estate platform for seamless property management and discovery.",
      challenge: "The local real estate market lacked a centralized, user-friendly digital platform for property listings and client management.",
      solution: "Developed a comprehensive web application with advanced search filters, virtual tours, and a robust agent dashboard.",
      technologies: "Next.js, Node.js, PostgreSQL, TailwindCSS",
      impact: "Increased property inquiries by 45% and reduced agent listing time by 60%.",
      image: "/assets/projects/deshproperty.png",
      published: true,
      order: 1,
      isFeatured: true
    },
    {
      title: "FoodChain",
      category: "Software",
      shortSummary: "Intelligent food supply chain management system.",
      challenge: "High food wastage due to inefficient supply chain tracking and inventory mismanagement.",
      solution: "Built a mobile-first platform using blockchain for traceability and AI for demand forecasting.",
      technologies: "React Native, Node.js, MongoDB, AWS",
      impact: "Reduced inventory wastage by 30% for participating vendors.",
      image: "/assets/projects/foodchain.png",
      published: true,
      order: 2,
      isFeatured: true
    },
    {
      title: "Smart LPG Gas Leakage Detection System",
      category: "IoT & Embedded",
      shortSummary: "Automated gas leakage detection and safety control.",
      challenge: "Domestic and industrial gas leaks cause severe accidents due to delayed detection.",
      solution: "IoT device that detects gas leaks, sounds an alarm, and sends instant SMS alerts to users while shutting off the main valve.",
      technologies: "Arduino, MQ-2 Gas Sensor, GSM Module, IoT Cloud",
      impact: "Prevents fire accidents and saves lives through instant automated response.",
      image: "/assets/projects/project-lpg.jpg",
      published: true,
      order: 3,
      isFeatured: true
    },
    {
      title: "Smart Guest Introduction System",
      category: "IoT & Embedded",
      shortSummary: "Automated identity recognition and greeting system.",
      challenge: "Manual visitor management in corporate offices is slow and prone to errors.",
      solution: "RFID and vision-based system to detect guests, verify identity, and display a personalized welcome message.",
      technologies: "Raspberry Pi, RFID, Python, OpenCV",
      impact: "Enhanced corporate security and modernized visitor experience.",
      image: "/assets/projects/project-guest.jpg",
      published: true,
      order: 4,
      isFeatured: false
    },
    {
      title: "Smart Gloves for Deaf & Dumb Communication",
      category: "IoT & Embedded",
      shortSummary: "Translates sign language into text and voice.",
      challenge: "Communication barrier between sign language users and the general public.",
      solution: "Sensory gloves that track hand movements, mapping them to predefined words outputted via a speaker.",
      technologies: "Flex Sensors, Arduino Nano, Bluetooth, Text-to-Speech",
      impact: "Empowers the speech/hearing impaired to communicate seamlessly with anyone.",
      image: "/assets/projects/project-gloves.jpg",
      published: true,
      order: 5,
      isFeatured: true
    },
    {
      title: "Smart Glasses for Blind (Face Recognition)",
      category: "IoT & Embedded",
      shortSummary: "Wearable assistant for the visually impaired to recognize faces.",
      challenge: "Visually impaired individuals struggle to identify people around them.",
      solution: "Camera-equipped smart glasses that use AI to recognize known faces and whisper names into an earpiece.",
      technologies: "Raspberry Pi Zero, TensorFlow Lite, Camera Module",
      impact: "Provides independence and confidence in social interactions.",
      image: "/assets/projects/project-glasses-face.jpg",
      published: true,
      order: 6,
      isFeatured: false
    },
    {
      title: "Smart Glasses for Blind (Haptic Feedback)",
      category: "IoT & Embedded",
      shortSummary: "Obstacle detection through haptic feedback.",
      challenge: "Navigation in unfamiliar environments is hazardous for the visually impaired.",
      solution: "Ultrasonic sensors mounted on glasses that vibrate upon detecting obstacles.",
      technologies: "Ultrasonic Sensors, Microcontroller, Vibration Motors",
      impact: "Reduces physical injuries by alerting users to obstacles at head height.",
      image: "/assets/projects/project-glasses-haptic.jpg",
      published: true,
      order: 7,
      isFeatured: false
    },
    {
      title: "Fire Fighting Robot",
      category: "Robotics",
      shortSummary: "Autonomous robot to detect and extinguish fires.",
      challenge: "Putting human firefighters at risk in structurally compromised, high-heat scenarios.",
      solution: "Built a tracked rover equipped with flame sensors, remote water cannons, and autonomous navigation.",
      technologies: "ROS, Arduino, Flame Sensors, DC Motors",
      impact: "Successfully tested in simulated disaster scenarios, reducing human exposure time.",
      image: "/assets/projects/project-robot-fire.jpg",
      published: true,
      order: 8,
      isFeatured: true
    },
    {
      title: "Obstacle Avoiding Robot",
      category: "Robotics",
      shortSummary: "Intelligent autonomous navigation bot.",
      challenge: "Robots in dynamic environments struggle to avoid unpredictable obstacles.",
      solution: "Robot chassis with an ultrasonic sensor mounted on a servo motor to scan surroundings and pathfind.",
      technologies: "Arduino UNO, Ultrasonic Sensor, Servo Motor, Motor Driver",
      impact: "A robust foundation for autonomous warehouse and delivery bots.",
      image: "/assets/projects/project-robot-obstacle.jpg",
      published: true,
      order: 9,
      isFeatured: false
    }
  ];

  for (const p of projectsData) {
    await prisma.project.create({
      data: p
    });
    console.log(`Created project: ${p.title}`);
  }

  // 2. Add Gunna Sateesh to TeamMember
  const existingSateesh = await prisma.teamMember.findFirst({
    where: { name: 'Gunna Sateesh' }
  });

  if (!existingSateesh) {
    await prisma.teamMember.create({
      data: {
        name: 'Gunna Sateesh',
        role: 'Operations & Business Coordinator',
        bio: 'Managing operational excellence, project coordination, client communication, financial workflow planning, and execution. Supports software, AI, embedded systems, and enterprise teams through structured planning and business operations.',
        expertise: 'Operations Management, Project Coordination, Client Relationship Management, Financial Planning, Business Development, Process Optimization, Team Coordination, Web Development',
        image: null,
        linkedinUrl: 'https://linkedin.com', // placeholder
        email: 'sateesh@csvertex.com',       // placeholder
        order: 2, // Assuming Harish is 1 or something, we can just put 2
        published: true
      }
    });
    console.log(`Added Team Member: Gunna Sateesh`);
  } else {
    console.log('Gunna Sateesh already exists.');
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
