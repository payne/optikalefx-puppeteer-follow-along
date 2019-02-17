'use strict';
const fs = require('fs-extra');
let raw = fs.readFileSync('output_formatted.json');
let dest = JSON.parse(raw);

const inputFileNames = [
  'youtube-output.json',
  'youtube-output_part2-1.json',
  'youtube-output_part2-2.json',
  'youtube-output_part2-3.json',
  'youtube-output_part2-4.json'];
inputFileNames.forEach(fn => {
  raw = fs.readFileSync(fn);
  let i = JSON.parse(raw);
  let m = i.reduce((a, x) => {
    a[x.page] = x.youTubeUrl;
    return a;
  }, {});
  dest.forEach(d => {
    if (m[d.href]) {
      d.youTubeUrl = m[d.href];
    }
  });
});

fs.writeFileSync('stitched.json', JSON.stringify(dest));
