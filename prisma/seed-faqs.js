const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const faqs = [
  {
    question: "What industries do you work with?",
    answer: "We work with startups, SMEs, educational institutions, healthcare, retail, manufacturing, logistics, finance, and enterprise businesses, delivering scalable digital solutions tailored to each industry.",
    category: "General",
    order: 1
  },
  {
    question: "Do you develop custom software according to business requirements?",
    answer: "Yes. Every software solution is designed specifically around your business workflow, ensuring maximum efficiency, scalability, and long-term growth.",
    category: "Web",
    order: 2
  },
  {
    question: "Can you redesign or upgrade an existing website?",
    answer: "Absolutely. We modernize outdated websites with improved UI/UX, better performance, enhanced security, mobile responsiveness, and SEO optimization.",
    category: "Web",
    order: 3
  },
  {
    question: "Do you provide mobile application development?",
    answer: "Yes. We build Android, iOS, and cross-platform mobile applications using modern technologies that deliver excellent performance and user experience.",
    category: "Web",
    order: 4
  },
  {
    question: "Do you offer AI and automation solutions?",
    answer: "Yes. We develop AI-powered applications, chatbots, workflow automation systems, recommendation engines, computer vision, and intelligent business solutions.",
    category: "AI",
    order: 5
  },
  {
    question: "What cybersecurity services do you provide?",
    answer: "We provide Vulnerability Assessment & Penetration Testing (VAPT), security audits, secure application development, network security assessments, and cybersecurity consulting.",
    category: "Cybersecurity",
    order: 6
  },
  {
    question: "Do you build IoT, Embedded Systems, and Robotics projects?",
    answer: "Yes. CS Vertex develops IoT devices, embedded systems, robotics prototypes, automation solutions, and smart hardware integrated with custom software.",
    category: "IoT",
    order: 7
  },
  {
    question: "Can you integrate third-party APIs and payment gateways?",
    answer: "Yes. We integrate payment gateways, SMS services, email services, CRMs, ERP systems, Google APIs, WhatsApp APIs, and other third-party platforms.",
    category: "General",
    order: 8
  },
  {
    question: "Will I receive source code ownership?",
    answer: "Yes. Upon project completion and final payment (as per agreement), ownership and source code can be transferred according to the project terms.",
    category: "Billing",
    order: 9
  },
  {
    question: "Do you provide maintenance after project delivery?",
    answer: "Yes. We offer flexible maintenance and support plans, including bug fixes, updates, monitoring, security patches, and feature enhancements.",
    category: "General",
    order: 10
  },
  {
    question: "How long does a typical project take?",
    answer: "Project timelines depend on complexity. Small websites may take 1–2 weeks, while enterprise software, AI solutions, or custom applications may require several weeks or months.",
    category: "General",
    order: 11
  },
  {
    question: "How do I track my project status?",
    answer: "Clients can log in to the Customer Portal to monitor project progress, view milestones, download documents, track quotations, and communicate with our team.",
    category: "General",
    order: 12
  },
  {
    question: "Can I request changes after development starts?",
    answer: "Yes. Additional features and modifications can be requested during development. Changes are reviewed, estimated, and implemented after approval.",
    category: "General",
    order: 13
  },
  {
    question: "How do you ensure software quality?",
    answer: "Every project undergoes code reviews, functional testing, responsive testing, security validation, performance optimization, and quality assurance before deployment.",
    category: "General",
    order: 14
  },
  {
    question: "Why should I choose CS Vertex?",
    answer: "CS Vertex combines modern technology, enterprise-grade development standards, AI expertise, cybersecurity knowledge, and dedicated client support to deliver reliable, scalable, and future-ready digital solutions.",
    category: "General",
    isFeatured: true,
    order: 15
  },
  {
    question: "Do you provide hosting, domain registration, and deployment services?",
    answer: "Yes. We assist with domain registration, hosting setup, SSL certificates, cloud deployment, email configuration, backups, and ongoing infrastructure management.",
    category: "Web",
    order: 16
  },
  {
    question: "Can you migrate my existing website to a new platform?",
    answer: "Yes. We safely migrate websites, databases, emails, and applications with minimal downtime while preserving data integrity and SEO performance.",
    category: "Web",
    order: 17
  },
  {
    question: "How do I get a quotation?",
    answer: "Simply submit a request through our Get Quote form. Our team will review your requirements, prepare a customized proposal, and send you a detailed quotation.",
    category: "Billing",
    order: 18
  },
  {
    question: "Are your solutions scalable for future business growth?",
    answer: "Yes. We design all software and web applications with scalability in mind so they can grow alongside your business without requiring a complete rebuild.",
    category: "General",
    order: 19
  },
  {
    question: "How can I contact the CS Vertex team?",
    answer: "You can reach us through our Contact page, WhatsApp, email, phone, or by submitting an inquiry through our website. Our team will respond as quickly as possible.",
    category: "General",
    order: 20
  }
];

async function main() {
  console.log("Seeding FAQs...");
  // Clear existing FAQs
  await prisma.fAQ.deleteMany({});
  
  for (const faq of faqs) {
    await prisma.fAQ.create({ data: faq });
  }
  console.log("Seeded " + faqs.length + " FAQs.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
