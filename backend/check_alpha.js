const jimp = require('jimp');

async function test() {
  const bg = await jimp.Jimp.read('test_composite2.png');
  let nonZeroAlpha = 0;
  let completelyTransparent = 0;
  bg.scan(0, 0, bg.bitmap.width, bg.bitmap.height, function(x, y, idx) {
    if (this.bitmap.data[idx+3] > 0) nonZeroAlpha++;
    if (this.bitmap.data[idx+3] === 0) completelyTransparent++;
  });
  console.log({nonZeroAlpha, completelyTransparent});
}
test();
