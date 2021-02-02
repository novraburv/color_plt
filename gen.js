function colorsFromHex(hex) {
    const RGB = hex.match(/[a-f\d]{2}/ig).map(x => {return parseInt(x, 16)});
    const [r, g, b] = RGB.map(x => {return x / 255});
    const MAX = Math.max(r, g, b), MIN = Math.min(r, g, b);
    let h, s, l = (MAX + MIN) / 2;
    const d = MAX - MIN;
    if (!d) {
        h = s = 0;
    } else {
        switch(MAX) {
            case r: h = (g - b) / d % 6; break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
        s = d / (1 - Math.abs(2 * l - 1));
    }
    const HSL = [h, s * 100, l * 100].map(x => Math.round(x));
    return {
        'hex': hex,
        'rgb': RGB,
        'hsl': HSL
    }
}