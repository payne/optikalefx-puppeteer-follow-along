const puppeteer = require('puppeteer');
const fs = require('fs-extra');

(async function main() {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const maxPages = 13;
    const outputFileName = 'output.txt';
    await fs.writeFile(outputFileName, 'TechOmaha Video info....\n');
    const videos = [];
    for (let pageNumber = 1; pageNumber <= maxPages; pageNumber++) {
      await page.goto(`http://techomaha.com/videos/page/${pageNumber}`);
      await page.waitForSelector('article');
      const articles = await page.$$('article');
      console.log(`there are ${articles.length} articles.`);
      let nextHref = '';
      for (const article of articles) {
        const href = await article.$eval('a', a => a.href);
        let imgsrc = '';
        try {
          imgsrc = await article.$eval('img', img => img.src);
        } catch (e) {
          console.log(`did not find an img: `, e);
        }
        const title = await article.$eval('.entry-title a', a => a.textContent);
        const content = await article.$eval('.post-content p', p => p.textContent);
        console.log(href);
        console.log(`\t${title}`);
        console.log(`\t${content}`);
        videos.push({ href, imgsrc, title, content });
        await fs.appendFile(outputFileName, `${href}\n`);
        if (href.includes('page')) {
          nextHref = href;
        }
      }
    }
    await fs.writeFile('output.json', JSON.stringify(videos));
    browser.close();
  } catch (e) {
    console.log('our error', e);
  }
})();