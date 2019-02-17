'use strict';
const puppeteer = require('puppeteer');
const fs = require('fs-extra');

(async function main() {
  try {
    let rawdata = fs.readFileSync('bad.json');
    let videoPageUrls = JSON.parse(rawdata);

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const youTubeInfo = [];
    const bad = [];
    for (let videoNumber = 0; videoNumber < videoPageUrls.length; videoNumber++) {
      await page.goto(videoPageUrls[videoNumber]);
      try {
        await page.waitForSelector('article');
        const article = await page.$$('article');
        console.log(`There are ${article.length} article.`);
        const youTubeUrl = await article[0].$eval('iframe', iframe => iframe.src);
        youTubeInfo.push({ page: videoPageUrls[videoNumber], youTubeUrl });
        await fs.writeFile('from-bad-youtube-output.json', JSON.stringify(youTubeInfo));
      } catch (eForUrl) {
        bad.push(videoPageUrls[videoNumber]);
        await fs.writeFile('from-bad-bad.json', JSON.stringify(bad));
        console.log(`When visiting ${videoPageUrls[videoNumber]} there was a problem! `, eForUrl);
      }
    }
    browser.close();
  } catch (e) {
    console.log('our error', e);
  }
})();