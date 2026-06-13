const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const updates = [
    {
      name: 'Chaitanya Kumar Sahu',
      email: 'chaitanyakumarsahu00@gmail.com',
      linkedinUrl: 'https://www.linkedin.com/in/chaitanya-kumar-sahu/',
      githubUrl: 'https://github.com/chaitu2303'
    },
    {
      name: 'Nithish Kumar Darimisetty',
      email: 'nithishkumardarimisetty@gmail.com',
      linkedinUrl: 'https://www.linkedin.com/in/nithish-kumar-darimisetty-37249134a/',
      githubUrl: 'https://share.google/QfxJalBpPz6mH1ewf'
    },
    {
      name: 'Gopi Vasant Kumar',
      email: 'vasanth18092005@gmail.com',
      linkedinUrl: 'https://www.linkedin.com/in/vasant-kumar-gopi-020a20319/',
      githubUrl: 'https://github.com/vasantgopi'
    },
    {
      name: 'Barru Harish',
      email: 'bharish1214@gmail.com',
      linkedinUrl: 'https://www.linkedin.com/in/b-harish-058ab7283/',
      githubUrl: 'https://github.com/BarruHarish?tab=repositories'
    },
    {
      name: 'Kalla Mahendra Nadha',
      email: 'mahirock969@gmail.com',
      linkedinUrl: 'https://www.linkedin.com/in/mahendra-n-bb23b9306/',
      githubUrl: null
    },
    {
      name: 'Gunna Sateesh',
      email: 'sateeshgunna09@gmail.com',
      linkedinUrl: 'https://www.linkedin.com/in/sateesh-gunna-33948534a/',
      githubUrl: null
    }
  ];

  for (const data of updates) {
    const member = await prisma.teamMember.findFirst({ where: { name: data.name } });
    if (member) {
      await prisma.teamMember.update({
        where: { id: member.id },
        data: {
          email: data.email,
          linkedinUrl: data.linkedinUrl,
          githubUrl: data.githubUrl
        }
      });
    } else {
      console.log(`Member not found: ${data.name}`);
    }
  }
  console.log('Team member links updated successfully');
}

main().finally(() => prisma.$disconnect());
