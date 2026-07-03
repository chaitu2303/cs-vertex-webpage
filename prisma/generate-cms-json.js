const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
const prisma = new PrismaClient();

const dataDir = path.join(__dirname, '../data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

async function main() {
  console.log("Generating static CMS JSON files from database...");

  const projects = await prisma.project.findMany({ orderBy: { order: 'asc' } });
  fs.writeFileSync(path.join(dataDir, 'projects.json'), JSON.stringify(projects, null, 2), 'utf-8');
  console.log(`- projects.json created with ${projects.length} entries`);

  const services = await prisma.service.findMany({ orderBy: { order: 'asc' } });
  fs.writeFileSync(path.join(dataDir, 'services.json'), JSON.stringify(services, null, 2), 'utf-8');
  console.log(`- services.json created with ${services.length} entries`);

  const team = await prisma.teamMember.findMany({ orderBy: { order: 'asc' } });
  fs.writeFileSync(path.join(dataDir, 'team.json'), JSON.stringify(team, null, 2), 'utf-8');
  console.log(`- team.json created with ${team.length} entries`);

  const announcements = await prisma.announcement.findMany({ orderBy: { createdAt: 'desc' } });
  fs.writeFileSync(path.join(dataDir, 'announcements.json'), JSON.stringify(announcements, null, 2), 'utf-8');
  console.log(`- announcements.json created with ${announcements.length} entries`);

  const testimonials = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } });
  fs.writeFileSync(path.join(dataDir, 'testimonials.json'), JSON.stringify(testimonials, null, 2), 'utf-8');
  console.log(`- testimonials.json created with ${testimonials.length} entries`);

  const courses = await prisma.course.findMany({ orderBy: { createdAt: 'desc' } });
  fs.writeFileSync(path.join(dataDir, 'courses.json'), JSON.stringify(courses, null, 2), 'utf-8');
  console.log(`- courses.json created with ${courses.length} entries`);

  const internships = await prisma.internship.findMany({ orderBy: { createdAt: 'desc' } });
  fs.writeFileSync(path.join(dataDir, 'internships.json'), JSON.stringify(internships, null, 2), 'utf-8');
  console.log(`- internships.json created with ${internships.length} entries`);

  const workshops = await prisma.workshop.findMany({ orderBy: { createdAt: 'desc' } });
  fs.writeFileSync(path.join(dataDir, 'workshops.json'), JSON.stringify(workshops, null, 2), 'utf-8');
  console.log(`- workshops.json created with ${workshops.length} entries`);

  console.log("All static CMS files successfully generated!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
