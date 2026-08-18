const fs = require('fs');
const file = 'components/originkit/button-carousel.tsx';
let lines = fs.readFileSync(file, 'utf8').split('\n');

// 1. Add quote
let quoteIdx = lines.findIndex(l => l.includes('label?: string;'));
lines.splice(quoteIdx + 1, 0, '    quote?: string;');

// 2. Add autoplay props type
let propsIdx = lines.findIndex(l => l.includes('backgroundColor?: string;'));
lines.splice(propsIdx + 1, 0, '    autoplay?: boolean;\n    autoplayInterval?: number;');

// 3. Add autoplay destructured
let desIdx = lines.findIndex(l => l.includes('backgroundColor = "#0a0a0a",'));
lines.splice(desIdx + 1, 0, '        autoplay = true,\n        autoplayInterval = 4000,');

// 4. Add autoplay useEffect
let effectIdx = lines.findIndex(l => l.includes('const center = Math.round(posDisplay);'));
lines.splice(effectIdx, 0, `
    useEffect(() => {
        if (!autoplay) return;
        const id = setInterval(() => {
            select(modIdx(Math.round(posRef.current) + 1, M));
        }, autoplayInterval);
        return () => clearInterval(id);
    }, [autoplay, autoplayInterval, M, select]);
`);

// 5. Replace img rendering
let imgStart = lines.findIndex(l => l.includes('{srcOf(list[active]?.image) && ('));
let imgEnd = imgStart;
while (!lines[imgEnd].includes(')}')) { imgEnd++; }
lines.splice(imgStart, imgEnd - imgStart + 1, `                        {list[active]?.quote ? (
                            <div style={{
                                width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "30px",
                                fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "24px", color: "rgba(255,255,255,0.85)", textAlign: "center", lineHeight: "1.5"
                            }}>
                                "{list[active].quote}"
                            </div>
                        ) : srcOf(list[active]?.image) ? (
                            <img
                                src={srcOf(list[active]?.image)}
                                alt=""
                                draggable={false}
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    display: "block",
                                }}
                            />
                        ) : null}`);

fs.writeFileSync(file, lines.join('\n'));
console.log('Successfully patched carousel');
