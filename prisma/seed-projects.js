const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding projects...');

  // 1. First, clear existing projects so we don't duplicate (Optional, but good for a fresh start based on prompt)
  await prisma.project.deleteMany({});
  
  // Data array
  const projectsData = [
    {
      title: "DeshProperty",
      category: "Software",
      shortSummary: "Modern real estate platform for seamless property management and discovery.",
      challenge: "The local real estate market lacked a centralized, user-friendly digital platform for property listings and client management.",
      solution: "Developed a comprehensive web application with advanced search filters, virtual tours, and a robust agent dashboard.",
      technologies: "Next.js, Node.js, PostgreSQL, TailwindCSS",
      impact: "Increased property inquiries by 45% and reduced agent listing time by 60%.",
      image: "/assets/projects/deshproperty.png", // Assuming this exists based on logs
      published: true,
      order: 1,
      isFeatured: true
    },
    {
      title: "FoodChain",
      category: "Mobile",
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
      title: "AI Customer Support Bot",
      category: "AI",
      shortSummary: "Next-gen conversational AI for automated customer service.",
      challenge: "Client was experiencing high support ticket volumes and long resolution times.",
      solution: "Deployed an NLP-driven chatbot integrated seamlessly into their existing CRM.",
      technologies: "Python, TensorFlow, OpenAI API, FastAPI",
      impact: "Automated 70% of tier-1 support queries.",
      image: "/assets/projects/project-guest.jpg",
      published: true,
      order: 3,
      isFeatured: false
    },
    {
      title: "Enterprise Cybersecurity Audit",
      category: "Cybersecurity",
      shortSummary: "Comprehensive security infrastructure overhaul for a fintech firm.",
      challenge: "Vulnerabilities in legacy systems posing significant financial data risks.",
      solution: "Conducted deep penetration testing and implemented zero-trust architecture.",
      technologies: "Kali Linux, Wireshark, Metasploit, AWS Security Hub",
      impact: "Achieved 100% compliance with ISO 27001 standards.",
      image: "/assets/projects/project-glasses-face.jpg",
      published: true,
      order: 4,
      isFeatured: false
    },
    {
      title: "Smart Factory IoT Sensor Grid",
      category: "IoT",
      shortSummary: "Real-time industrial monitoring and predictive maintenance.",
      challenge: "Unexpected machine downtime costing thousands per hour.",
      solution: "Installed a network of IoT vibration and temperature sensors with cloud analytics.",
      technologies: "Arduino, Raspberry Pi, AWS IoT Core, Python",
      impact: "Decreased machine downtime by 85% through predictive alerts.",
      image: "/assets/projects/project-lpg.jpg",
      published: true,
      order: 5,
      isFeatured: true
    },
    {
      title: "Embedded Robotics Controller",
      category: "Embedded",
      shortSummary: "Custom embedded system for autonomous delivery robots.",
      challenge: "Off-the-shelf controllers were too slow for real-time obstacle avoidance.",
      solution: "Designed a custom PCB and wrote low-level C firmware for instantaneous processing.",
      technologies: "C, C++, ARM Cortex-M, PCB Design",
      impact: "Improved robot reaction time by 400%.",
      image: "/assets/projects/project-robot-obstacle.jpg",
      published: true,
      order: 6,
      isFeatured: false
    },
    {
      title: "Autonomous Firefighting Rover",
      category: "Robotics",
      shortSummary: "A rugged robotic rover designed for hazardous fire environments.",
      challenge: "Putting human firefighters at risk in structurally compromised, high-heat scenarios.",
      solution: "Built a tracked rover equipped with thermal imaging, remote water cannons, and autonomous navigation.",
      technologies: "ROS (Robot Operating System), Python, LiDAR, Computer Vision",
      impact: "Successfully tested in 3 simulated disaster scenarios, reducing human exposure time to 0.",
      image: "/assets/projects/project-robot-fire.jpg",
      published: true,
      order: 7,
      isFeatured: true
    }
  ];

  for (const p of projectsData) {
    await prisma.project.create({
      data: p
    });
    console.log(`Created project: ${p.title}`);
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
