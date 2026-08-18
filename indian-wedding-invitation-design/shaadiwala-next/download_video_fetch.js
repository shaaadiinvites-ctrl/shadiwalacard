const fs = require('fs');

async function downloadVideo() {
  const url = 'https://assets.mixkit.co/videos/preview/mixkit-bride-and-groom-holding-hands-and-walking-in-the-park-43282-large.mp4';
  const dest = 'public/uploads/hero-bg.mp4';
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(dest, Buffer.from(buffer));
    console.log(`Video downloaded successfully. Size: ${buffer.byteLength} bytes`);
  } catch (e) {
    console.error('Download failed:', e);
  }
}

downloadVideo();
