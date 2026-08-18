const https = require('https');

const req = https.get('https://withjoy.com', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  }
}, (res) => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    // Extract font-family
    const fonts = body.match(/font-family:[^;\"\}]+/g);
    const uniqueFonts = [...new Set(fonts)];
    console.log('--- Fonts ---');
    console.log(uniqueFonts.slice(0, 10).join('\n'));

    // Extract font-sizes
    const sizes = body.match(/font-size:[^;\"\}]+/g);
    const uniqueSizes = [...new Set(sizes)];
    console.log('\n--- Font Sizes ---');
    console.log(uniqueSizes.slice(0, 10).join('\n'));

    // Extract CSS frameworks/grid
    if (body.includes('grid-template-columns')) {
      console.log('\n--- Grid Usage ---');
      console.log('Uses CSS Grid (grid-template-columns found)');
    }
    if (body.includes('flex')) {
      console.log('Uses Flexbox (flex found)');
    }
    
    // Look for CSS variables
    const vars = body.match(/--[\w-]+:[^;\}]+/g);
    if (vars) {
      console.log('\n--- CSS Variables (Theme/Spacing/Grid) ---');
      const filteredVars = vars.filter(v => v.includes('font') || v.includes('space') || v.includes('grid') || v.includes('size')).slice(0, 20);
      console.log(filteredVars.join('\n'));
    }
  });
});
req.on('error', console.error);
req.end();
