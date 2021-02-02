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
    const HSL = [h, s * 100, l * 100].map(x => {return x < 0 ? x + 360 : x}).map(x => {return Math.round(x)});
    return {
        'hex': hex,
        'rgb': RGB,
        'hsl': HSL
    }
}
function generate(colorCodes, method) {
    const METHODS = {
        monochrome: [0],
        analogous: [-60, 0, 60],
        complementary: [0, 180],
        split_complementary: [0, 150, 210],
        triangle: [0, 120, 240],
        tetradic: [0, 60, 180, 240],
        tetradic_square: [0, 90, 180, 270]
    };
    const BASE = colorCodes.hsl[0];
    const KEYS = Object.keys(METHODS);
    function randomIndex(a) {
        return Math.floor(Math.random() * a.length)
    }
    function hues(b, m) {
        const gHues = [];
        while (gHues.length < 5) {
            if (m === 'analogous') {
                gHues.push(BASE + (Math.floor(Math.random() * (METHODS[m][2] - METHODS[m][0]) + METHODS[m][0])));
            } else {
                gHues.push(BASE + METHODS[m][randomIndex(METHODS[m])]);
            }
        }
        return gHues.map(x => {return x < 0 ? x + 360 : x >= 360 ? x - 360 : x}) + m + BASE;
    }
    return method === 'auto' ? hues(BASE, KEYS[randomIndex(KEYS)]) : hues(BASE, method);
}