const puppeteer = require('puppeteer');
const fs = require('fs-extra');

(async function main() {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const maxPages = 13;
    const outputFileName = 'output.txt';
    await fs.writeFile(outputFileName, 'TechOmaha Video info....\n');
    for (let pageNumber = 1; pageNumber <= maxPages; pageNumber++) {
      await page.goto(`http://techomaha.com/videos/page/${pageNumber}`);
      await page.waitForSelector('article');
      const articles = await page.$$('article');
      console.log(`there are ${articles.length} articles.`);
      let nextHref = '';
      for (const article of articles) {
        const href = await article.$eval('a', a => a.href);
        console.log(href);
        await fs.appendFile(outputFileName, `${href}\n`);
        if (href.includes('page')) {
          nextHref = href;
        }
      }
    }
    browser.close();
  } catch (e) {
    console.log('our error', e);
  }
})();