const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

(async () => {
  console.log('Launching browser...');
  const browser = await chromium.launch();
  const screenshotDir = 'C:\\Users\\Zarwaish Hassan\\.gemini\\antigravity\\brain\\578bba16-da79-4e2e-a310-538499b110f7';
  
  // 1. Context with bypass_auth for general and admin pages
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  await context.addCookies([
    {
      name: 'bypass_auth',
      value: 'true',
      domain: 'localhost',
      path: '/'
    }
  ]);

  const page = await context.newPage();

  const pagesToScreenshot = [
    { name: 'home_page', url: 'http://localhost:3000/' },
    { name: 'portfolio_page', url: 'http://localhost:3000/portfolio' },
    { name: 'project_details_page', url: 'http://localhost:3000/portfolio/non-existent-artifact' },
    { name: 'admin_dashboard', url: 'http://localhost:3000/admin' },
    { name: 'add_project_page', url: 'http://localhost:3000/admin/projects/new' }
  ];

  for (const item of pagesToScreenshot) {
    console.log(`Navigating to ${item.url}...`);
    try {
      await page.goto(item.url, { waitUntil: 'domcontentloaded' });
      // Wait for Framer Motion transitions/animations to settle
      await page.waitForTimeout(2000);
      
      const screenshotPath = path.join(screenshotDir, `${item.name}.png`);
      console.log(`Taking screenshot for ${item.name} at ${screenshotPath}...`);
      await page.screenshot({ path: screenshotPath, fullPage: false });
    } catch (err) {
      console.error(`Failed to screenshot ${item.name}:`, err);
    }
  }
  await context.close();

  // 2. Clean context for login page (so it doesn't redirect to /admin)
  console.log('Taking login page screenshot in clean context...');
  const cleanContext = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const cleanPage = await cleanContext.newPage();
  try {
    await cleanPage.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });
    await cleanPage.waitForTimeout(2000);
    const screenshotPath = path.join(screenshotDir, 'login_page.png');
    await cleanPage.screenshot({ path: screenshotPath, fullPage: false });
  } catch (err) {
    console.error('Failed to screenshot login page:', err);
  }

  // 3. Clean context for signup page (so it doesn't redirect to /admin)
  console.log('Taking signup page screenshot in clean context...');
  try {
    await cleanPage.goto('http://localhost:3000/signup', { waitUntil: 'domcontentloaded' });
    await cleanPage.waitForTimeout(2000);
    const screenshotPath = path.join(screenshotDir, 'signup_page.png');
    await cleanPage.screenshot({ path: screenshotPath, fullPage: false });
  } catch (err) {
    console.error('Failed to screenshot signup page:', err);
  }

  await cleanContext.close();

  console.log('Closing browser...');
  await browser.close();
})();
