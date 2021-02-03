/* hex2rgbhsl generates RGB and HSL value from hex */
function hex2rgbhsl(hex) {
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
/* generateHues generates random hues based on 2 parameters, i.e. HSL hue as the base hue and chosen method.
The output is an object that contains color codes from colorCodes parameter, method used by this function and generated hues */
function generateHues(colorCodes, method) {
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
                gHues.push(b + (Math.floor(Math.random() * (METHODS[m][2] - METHODS[m][0]) + METHODS[m][0])));
            } else {
                gHues.push(b + METHODS[m][randomIndex(METHODS[m])]);
            }
        }
        return gHues.map(x => {return x < 0 ? x + 360 : x >= 360 ? x - 360 : x});
    }
    return {colorCodes, 'method': method, 'genHues': method === 'auto' ? hues(BASE, KEYS[randomIndex(KEYS)]) : hues(BASE, method)};
}
/* random100 generates random number between 0 - 100 */
function random100() {
    return Math.floor(Math.random() * 100);
}
function printOutput(func) {
    const output = document.getElementById('output-container');
    let n = 1;
    output.innerHTML = '<!--nothing to see-->';
    func.genHues.map(x => {
        const color = document.createElement('div');
        color.setAttribute('class', 'output');
        color.setAttribute('id', `color${n}`);
        color.setAttribute('style', `background-color: hsl(${x}, ${random100()}%, ${random100()}%)`)
        output.append(color);
        n++
    })
}