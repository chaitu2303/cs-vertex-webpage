const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Intercept requests to see what is triggering the reload
  page.on('request', request => {
    console.log('[' + request.resourceType() + '] ' + request.url());
  });

  page.on('console', msg => console.log('BROWSER CONSOLE: ' + msg.text()));

  try {
    await page.goto('http://localhost:3000/admin/login', { waitUntil: 'networkidle0', timeout: 10000 });
  } catch (e) {
    console.log('Timeout or error: ' + e.message);
  }
  
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();