import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // --- CLEAR EXISTING TEAM MEMBERS ---
  await prisma.teamMember.deleteMany({})

  // --- SEED NEW TEAM MEMBERS ---
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
  ]

  for (const member of team) {
    await prisma.teamMember.create({
      data: member
    })
  }

  // --- CLEAR EXISTING PROJECTS ---
  await prisma.project.deleteMany({})

  // --- SEED PROJECTS ---
  const projects = [
    {
      title: 'DESH Property',
      category: 'Software',
      shortSummary: 'Real Estate Management Platform',
      challenge: 'Managing scattered real estate listings and fragmented customer interactions.',
      solution: 'A unified enterprise web platform for property management.',
      technologies: 'Next.js, Node.js, PostgreSQL',
      impact: 'Streamlined operations for 50+ real estate agents.',
      image: '/assets/brochures/desh-property.png',
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
      image: '/assets/brochures/food-chain.jpg',
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
      image: '/assets/hardware/smart-lpg.jpg',
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
      image: '/assets/hardware/smart-gloves.jpg',
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
      image: '/assets/hardware/smart-guest.png',
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
      image: '/assets/hardware/smart-glasses.jpg',
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
      image: '/assets/hardware/fire-fighting.jpg',
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
      image: '/assets/hardware/obstacle-avoiding.webp',
      order: 8
    }
  ]

  for (const project of projects) {
    await prisma.project.create({
      data: project
    })
  }

  console.log('Seeded actual CS Vertex founders/team members and projects.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
