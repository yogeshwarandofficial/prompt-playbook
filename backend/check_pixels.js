const jimp = require('jimp');

async function test() {
  const bg = await jimp.Jimp.read('test_composite.png');
  let blackPixels = 0;
  let whitePixels = 0;
  bg.scan(0, 0, bg.bitmap.width, bg.bitmap.height, function(x, y, idx) {
    const r = this.bitmap.data[idx];
    const g = this.bitmap.data[idx+1];
    const b = this.bitmap.data[idx+2];
    if (r === 0 && g === 0 && b === 0) blackPixels++;
    if (r === 255 && g === 255 && b === 255) whitePixels++;
  });
  console.log({blackPixels, whitePixels});
}
test();
