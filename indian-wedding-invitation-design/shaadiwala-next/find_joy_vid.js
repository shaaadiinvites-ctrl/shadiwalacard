const https = require('https');

https.get('https://withjoy.com', {
  headers: { 'User-Agent': 'Mozilla/5.0' }
}, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const vids = body.match(/https:\/\/[^"'\s]+\.mp4/g);
    const unique = [...new Set(vids)];
    console.log("Found mp4 URLs:");
    console.log(unique);
  });
}).on('error', console.error);
