'use strict';
const puppeteer = require('puppeteer');
const fs = require('fs-extra');

(async function main() {
  try {
    let rawdata = fs.readFileSync('output_formatted.json');
    let to = JSON.parse(rawdata);
    let videoPageUrls = to.map(v => v.href);

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const youTubeInfo = [];
    for (let videoNumber = 0; videoNumber < videoPageUrls.length; videoNumber++) {
      await page.goto(videoPageUrls[videoNumber]);
      try {
        await page.waitForSelector('article');
        const article = await page.$$('article');
        console.log(`There are ${article.length} article.`);
        const youTubeUrl = await article[0].$eval('iframe', iframe => iframe.src);
        youTubeInfo.push({ page: videoPageUrls[videoNumber], youTubeUrl });
        await fs.writeFile('youtube-output.json', JSON.stringify(youTubeInfo));
      } catch (eForUrl) {
        console.log(`When visiting ${videoPageUrls[videoNumber]} there was a problem! `, eForUrl);
      }
    }
    browser.close();
  } catch (e) {
    console.log('our error', e);
  }
})();