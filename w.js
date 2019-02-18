'use strict';
const fs = require('fs-extra');
let raw = fs.readFileSync('TechOmaha.json');
let to = JSON.parse(raw);
to.videos.forEach(v => {
  let parts = v.imgsrc.split('/');
  v.imgsrc = `video_thumbnails/${parts[parts.length - 1]}`;
});
fs.writeFileSync("to.json", JSON.stringify(to));
