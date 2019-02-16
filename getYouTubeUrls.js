'use strict';
const fs = require('fs');
let rawdata = fs.readFileSync('output_formatted.json');
let to = JSON.parse(rawdata);
let videoPageUrls = to.map(v => v.href);
console.log(JSON.stringify(videoPageUrls));
