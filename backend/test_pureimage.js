const PImage = require('pureimage');
const fs = require('fs');
const path = require('path');
const jimp = require('jimp');
const { PassThrough } = require('stream');

async function test() {
  const fontPath = path.join(__dirname, '..', 'public', 'PinyonScript-Regular.ttf');
  const fnt = PImage.registerFont(fontPath, 'PinyonScript');
  fnt.loadSync();

  const pimg = PImage.make(1184, 200);
  const ctx = pimg.getContext('2d');
  
  // Try clearRect
  if (ctx.clearRect) {
    ctx.clearRect(0, 0, 1184, 200);
  } else {
    console.log("No clearRect!");
  }
  
  ctx.fillStyle = 'rgba(12, 31, 56, 1)';
  ctx.font = "120pt 'PinyonScript'";
  ctx.fillText('infy', 100, 100);

  const pass = new PassThrough();
  const chunks = [];
  pass.on('data', chunk => chunks.push(Buffer.from(chunk)));
  
  await PImage.encodePNGToStream(pimg, pass);
  const buffer = Buffer.concat(chunks);
  
  const jImg = await jimp.Jimp.read(buffer);
  
  let nonZeroAlpha = 0;
  let completelyTransparent = 0;
  jImg.scan(0, 0, jImg.bitmap.width, jImg.bitmap.height, function(x, y, idx) {
    if (this.bitmap.data[idx+3] > 0) nonZeroAlpha++;
    if (this.bitmap.data[idx+3] === 0) completelyTransparent++;
  });
  console.log({nonZeroAlpha, completelyTransparent});
}
test();
