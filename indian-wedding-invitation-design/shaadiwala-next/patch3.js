const fs = require('fs');
const file = 'components/originkit/button-carousel.tsx';
let code = fs.readFileSync(file, 'utf8');

const replacementImageBlock = `{list[active]?.quote ? (
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
                        ) : null}`;

let codeUnix = code.replace(/\r\n/g, '\n');

// 1. quote
codeUnix = codeUnix.replace(
`interface CarouselItem {
    buttonImage?: ImageValue;
    image?: ImageValue;
    label?: string;
}`,
`interface CarouselItem {
    buttonImage?: ImageValue;
    image?: ImageValue;
    label?: string;
    quote?: string;
}`);

// 2. props
codeUnix = codeUnix.replace(
`    backgroundColor?: string;
    style?: CSSProperties;
}`,
`    backgroundColor?: string;
    autoplay?: boolean;
    autoplayInterval?: number;
    style?: CSSProperties;
}`);

// 3. destructure
codeUnix = codeUnix.replace(
`        backgroundColor = "#0a0a0a",
    } = props;`,
`        backgroundColor = "#0a0a0a",
        autoplay = true,
        autoplayInterval = 4000,
    } = props;`);

// 4. useEffect
codeUnix = codeUnix.replace(
`    useEffect(() => {
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    const center = Math.round(posDisplay);`,
`    useEffect(() => {
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    useEffect(() => {
        if (!autoplay) return;
        const id = setInterval(() => {
            select(modIdx(Math.round(posRef.current) + 1, M));
        }, autoplayInterval);
        return () => clearInterval(id);
    }, [autoplay, autoplayInterval, M, select]);

    const center = Math.round(posDisplay);`);

// 5. Image replacement block
const regexBlock = /\{srcOf\(list\[active\]\?\.image\) && \(\s*<img\s*src=\{srcOf\(list\[active\]\?\.image\)\}\s*alt=""\s*draggable=\{false\}\s*style=\{\{\s*width: "100%",\s*height: "100%",\s*objectFit: "cover",\s*display: "block",?\s*\}\}\s*\/>\s*\)\}/m;

codeUnix = codeUnix.replace(regexBlock, replacementImageBlock);

fs.writeFileSync(file, codeUnix);
console.log('Successfully patched carousel');
