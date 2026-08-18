const https = require('https');
const fs = require('fs');

const url = 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-holding-hands-and-walking-in-the-park-43282-large.mp4';
const dest = 'public/uploads/hero-bg.mp4';

const file = fs.createWriteStream(dest);

https.get(url, function(response) {
  response.pipe(file);
  file.on('finish', function() {
    file.close();
    console.log('Video downloaded successfully');
  });
}).on('error', function(err) {
  fs.unlink(dest, () => {});
  console.error('Error downloading video:', err.message);
});
