const { Jimp } = require('jimp');
// For older jimp versions
const jimpModule = require('jimp');

async function processImage() {
  try {
    const jimpToUse = Jimp || jimpModule;
    const image = await jimpToUse.read('public/model.png');
    const w = image.bitmap.width;
    const h = image.bitmap.height;
    
    // Scan all pixels
    image.scan(0, 0, w, h, function(x, y, idx) {
      const r = this.bitmap.data[idx + 0];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      // If it is very close to white, make it transparent
      if (r > 230 && g > 230 && b > 230) {
        this.bitmap.data[idx + 3] = 0;
      }
    });
    
    await image.writeAsync('public/model-transparent.png');
    console.log("Image processed successfully.");
  } catch (err) {
    console.error(err);
  }
}

processImage();
