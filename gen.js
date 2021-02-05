// hex2rgbhsl generates RGB and HSL value from hex 
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
// generateHues generates random hues based on 2 parameters, i.e. HSL hue as the base hue and chosen method.
// The output is an object that contains color codes from colorCodes parameter, method used by this function and generated hues 
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
// random100 generates random number between 0 - 100 
function random100() {
    return Math.floor(Math.random() * 100);
}
// its name explains 
function printOutput(func) {
    const output = document.getElementById('output-container');
    let n = 1;
    output.innerHTML = '<!--area cleared-->';
    func.genHues.forEach(x => {
        // details object will be used later, to be shown in each panel 
        const details = {'hex': '', 'rgb':'', 'hsl': `hsl(${x}, ${random100()}%, ${random100()}%)`}
        // create divs with their respective id 
        const color = document.createElement('div');
        color.setAttribute('class', 'output');
        color.setAttribute('id', `color${n}`);
        output.append(color);
        // select each div and fill it with color 
        const panel = document.getElementById(`color${n}`);
        panel.style.backgroundColor = `${details.hsl}`;
        // add hex and rgb codes to details 
        details.rgb = panel.style.backgroundColor;
        details.hex = details.rgb.match(/\d+/g).map(x => {
            const string = Number(x).toString(16);
            return string.length < 2 ? string + string : string;
        }).reduce((a, b) => {return a + b},'#');
        // write details to each panel 
        Object.keys(details).forEach(x => {
            const para = document.createElement('p');
            para.setAttribute('class', `details details_color${n} details-${x}`);
            para.innerText = details[x].toUpperCase();
            panel.append(para);
        })
        // adjust details text color based on their background 
        const fg = details.hsl.match(/\d+/g)[2] < 30 ? 'var(--light-neu)' : 'var(--dark-neu)';
        Object.keys(document.getElementsByClassName(`details_color${n}`)).forEach(x => {
            document.getElementsByClassName(`details_color${n}`)[x].style.color = fg;
        })
        // counter, put it on the end! 
        n++;
    })
}