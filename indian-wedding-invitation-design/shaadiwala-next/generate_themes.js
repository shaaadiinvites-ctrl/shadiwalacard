const fs = require('fs');
const path = require('path');

const baseFile = 'app/page.tsx';
let baseCode = fs.readFileSync(baseFile, 'utf8');

function generateTheme(themeName, bg, text, softText, border, glass, cardBg) {
    let code = baseCode;

    // Backgrounds
    code = code.replace(/background: '#000'/g, `background: '${bg}'`);
    code = code.replace(/background: '#0a0a0a'/g, `background: '${cardBg}'`);
    code = code.replace(/backgroundColor="#0a0a0a"/g, `backgroundColor="${cardBg}"`);

    // Text colors
    code = code.replace(/color: '#eef0f8'/g, `color: '${text}'`);
    code = code.replace(/color: '#fff'/g, `color: '${text}'`);
    
    // Soft text / rgba(...)
    code = code.replace(/rgba\(255,255,255,0\.45\)/g, softText);
    code = code.replace(/rgba\(255,255,255,0\.6\)/g, softText);
    code = code.replace(/rgba\(255,255,255,0\.38\)/g, softText);
    code = code.replace(/rgba\(255,255,255,0\.5\)/g, softText);
    code = code.replace(/rgba\(255,255,255,0\.25\)/g, softText);
    code = code.replace(/rgba\(255,255,255,0\.7\)/g, text); // hamburger icon

    // Borders
    code = code.replace(/rgba\(255,255,255,0\.06\)/g, border);
    code = code.replace(/rgba\(255,255,255,0\.07\)/g, border);
    code = code.replace(/rgba\(255,255,255,0\.1\)/g, border);
    code = code.replace(/rgba\(255,255,255,0\.2\)/g, border);

    // Glass / Overlays
    code = code.replace(/rgba\(0,0,0,0\.82\)/g, glass);
    code = code.replace(/rgba\(0,0,0,0\.95\)/g, glass);
    code = code.replace(/rgba\(0,0,0,0\.8\)/g, glass); // Vignette
    code = code.replace(/rgba\(0,0,0,0\.75\)/g, glass); // Parallax overlay
    code = code.replace(/rgba\(0,0,0,0\.72\)/g, glass); // Badge background

    // Gradients in parallax
    code = code.replace(/linear-gradient\(to bottom, #000 0%, transparent 15%, transparent 85%, #000 100%\)/g, 
                        `linear-gradient(to bottom, ${bg} 0%, transparent 15%, transparent 85%, ${bg} 100%)`);
    code = code.replace(/linear-gradient\(to right, #000 0%, transparent 15%, transparent 85%, #000 100%\)/g, 
                        `linear-gradient(to right, ${bg} 0%, transparent 15%, transparent 85%, ${bg} 100%)`);

    // Buttons
    code = code.replace(/background: rgba\(255,255,255,0\.05\)/g, `background: rgba(0,0,0,0.02)`);
    
    // Shadows
    code = code.replace(/boxShadow: '0 8px 32px rgba\(0,0,0,0\.5\)'/g, `boxShadow: '0 12px 40px rgba(0,0,0,0.08)'`);
    code = code.replace(/boxShadow: '0 4px 32px rgba\(0,0,0,0\.6\)'/g, `boxShadow: '0 4px 32px rgba(0,0,0,0.06)'`);
    
    // Pin bounce background
    code = code.replace(/background: '#0a1020'/g, `background: '#fff'`);

    // Write file
    const dir = 'app/' + themeName;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'page.tsx'), code);
    console.log("Generated " + themeName);
}

// 1. Warm Golden Ivory (Yellow/Gold tint)
generateTheme('ivory', '#FFF6E5', '#4A3525', 'rgba(74,53,37,0.6)', 'rgba(74,53,37,0.15)', 'rgba(255,246,229,0.85)', '#FFFFFF');

// 2. Cool Silver Pearl (Blue/Silver tint)
generateTheme('pearl', '#F2F4F8', '#1A202C', 'rgba(26,32,44,0.6)', 'rgba(26,32,44,0.15)', 'rgba(242,244,248,0.85)', '#FFFFFF');

// 3. Soft Blush Rose (Pink/Rose tint)
generateTheme('alabaster', '#FFF0F5', '#4A1525', 'rgba(74,21,37,0.6)', 'rgba(74,21,37,0.15)', 'rgba(255,240,245,0.85)', '#FFFFFF');
