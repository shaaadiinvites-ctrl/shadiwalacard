const { Jimp } = require('jimp');
const fs = require('fs');

async function removeBlackBackground() {
  const inputFile = 'public/uploads/envelope_icon.jpg';
  const outputFile = 'public/uploads/envelope_icon_transparent.png';

  console.log('Loading image...');
  const image = await Jimp.read(inputFile);

  console.log('Processing pixels...');
  // Iterate through all pixels
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    const r = this.bitmap.data[idx + 0];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];

    // If the pixel is pure black or very close to it
    if (r < 15 && g < 15 && b < 15) {
      // Set alpha to 0 (transparent)
      this.bitmap.data[idx + 3] = 0;
    }
  });

  console.log('Writing transparent PNG...');
  await image.write(outputFile);
  console.log('Done! Background removed.');
}

removeBlackBackground().catch(console.error);
