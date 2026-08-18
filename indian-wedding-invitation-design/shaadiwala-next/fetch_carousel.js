const https = require('https');
const fs = require('fs');
const url = 'https://mcp.originkit.dev/mcp';
const headers = { 
  'Authorization': 'Bearer cmp_live_552M8sbmL0NttKxq1szkccRO-Wvj3Ju1',
  'Content-Type': 'application/json'
};

const data = JSON.stringify({
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/call',
  params: {
    name: 'get_component',
    arguments: {
      name: 'button-carousel',
      stack: 'nextjs',
      styling: 'css',
      typescript: true
    }
  }
});

const req = https.request(url, { method: 'POST', headers }, (res) => {
  let body = '';
  res.on('data', (chunk) => body += chunk.toString());
  res.on('end', () => {
    try {
      const response = JSON.parse(body);
      const contentText = response.result.content[0].text;
      const match = contentText.match(/```tsx\n([\s\S]*?)```/);
      if (match) {
        const code = match[1];
        const destDir = require('path').join(__dirname, 'components', 'originkit');
        if (!fs.existsSync(destDir)){
            fs.mkdirSync(destDir, { recursive: true });
        }
        fs.writeFileSync(require('path').join(destDir, 'button-carousel.tsx'), code);
        console.log('Successfully saved to components/originkit/button-carousel.tsx');
      } else {
        console.error('Could not extract code from response:', contentText.substring(0, 500));
      }
    } catch(e) {
      console.error('Error parsing response:', e);
    }
  });
});

req.on('error', (e) => console.error(e));
req.write(data);
req.end();
