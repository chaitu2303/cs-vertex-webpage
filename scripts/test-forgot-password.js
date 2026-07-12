const { PrismaClient } = require('@prisma/client');
const http = require('http');

const prisma = new PrismaClient();

async function makeRequest(path, payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          body: JSON.parse(body || '{}')
        });
      });
    });

    req.on('error', (e) => reject(e));
    req.write(data);
    req.end();
  });
}

async function testForgotPassword() {
  console.log('Creating mock admin...');
  const testEmail = 'testadmin' + Date.now() + '@example.com';
  
  await prisma.admin.create({
    data: {
      email: testEmail,
      password: 'hashed_mock_password' // normally hashed, but just for DB insert
    }
  });

  console.log('Sending forgot password request for:', testEmail);
  const res = await makeRequest('/api/auth/forgot-password', { email: testEmail });
  console.log('Status code:', res.statusCode);
  
  // Wait a couple seconds for background processing
  await new Promise(r => setTimeout(r, 2000));

  console.log('Checking EmailLog table...');
  const logs = await prisma.emailLog.findMany({
    where: { to: testEmail },
    orderBy: { createdAt: 'desc' }
  });

  console.log('Logs found:');
  console.log(JSON.stringify(logs, null, 2));

  // Cleanup
  await prisma.admin.delete({ where: { email: testEmail } });
  prisma.$disconnect();
}

testForgotPassword().catch(console.error);
