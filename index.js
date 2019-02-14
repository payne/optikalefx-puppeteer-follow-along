
const puppeteer = require('puppeteer');

(async function main() {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('http://techomaha.com/videos/');
    await page.waitForSelector('article');
    const articles = await page.$$('article');
    console.log(`there are ${articles.length} articles.`);
    for (const article of articles) {
      const href = await article.$eval('a', a => a.href);
      console.log(href);
    }
  } catch (e) {
    console.log('our error', e);
  }
})();