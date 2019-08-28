module.exports = {
    RGBtoXYZ: function (triplet) {
        triplet = triplet.map(e => e / 255);

        for (let i = 0; i < triplet.length; i++) {
            triplet[i] = (triplet[i] > 0.04045) ? Math.pow(((triplet[i] + 0.055) / 1.055), 2.4) : (triplet[i] / 12.92);
        }

        triplet = triplet.map(e => e * 100);
        let X = (triplet[0] * 0.4124564) + (triplet[1] * 0.3575761) + (triplet[2] * 0.1804375);
        let Y = (triplet[0] * 0.2126729) + (triplet[1] * 0.7151522) + (triplet[2] * 0.0721750);
        let Z = (triplet[0] * 0.0193339) + (triplet[1] * 0.1191920) + (triplet[2] * 0.9503041);

        let result = [X, Y, Z];
        result = result.map(e => {
            let s = e.toFixed(4).toString();
            s = Number(s.substr(0, s.length - 1));
            return s;
        });

        return result;
    },
    XYZtoRGB: function (triplet) {
        triplet = triplet.map(e => e / 100);

        let R = triplet[0] * 3.2406 + triplet[1] * -1.5372 + triplet[2] * -0.4986;
        let G = triplet[0] * -0.9689 + triplet[1] * 1.8758 + triplet[2] * 0.0415;
        let B = triplet[0] * 0.0557 + triplet[1] * -0.2040 + triplet[2] * 1.0570;
        let result = [R, G, B];

        for (let i = 0; i < result.length; i++) {
            result[i] = (result[i] > 0.0031308) ? ((1.055 * Math.pow(result[i], 1 / 2.4)) - 0.055) : (result[i] * 12.92);
        }

        let original = result.map(e => Math.floor(Math.round(e * 255)));
        let clamped = original.map(e => {
            return (e < 0) ? 0 : (e > 255) ? 255 : e;
        });

        return {
            original: original,
            clamped: clamped
        };
    },
    RGBtoHSL: function (triplet) {
        triplet = triplet.map(e => e / 255)
        let min = Math.min(...triplet);
        let max = Math.max(...triplet);

        let chroma = max - min

        let h;
        if (chroma === 0) h = 0;
        else if (max === triplet[0]) {
            h = ((triplet[1] - triplet[2]) / chroma) % 6;
        } else if (max === triplet[1]) {
            h = ((triplet[2] - triplet[0]) / chroma) + 2;
        } else if (max === triplet[2]) {
            h = ((triplet[0] - triplet[1]) / chroma) + 4;
        }

        let H = h * 60;
        let L = (max + min) / 2;
        let S = (L === 0 || L === 1) ? 0 : (chroma / (1 - Math.abs(2 * L - 1)))

        let res = [H, S * 100, L * 100].map(e => Math.floor(Math.round(e)))

        return res;
    },
    HSLtoRGB: function (triplet) {
        let H = triplet[0];
        let S = triplet[1] / 100;
        let L = triplet[2] / 100;

        let chroma = (1 - Math.abs(2 * L - 1)) * S;
        H /= 60;
        let X = chroma * (1 - Math.abs(H % 2 - 1));

        let r = 0,
            g = 0,
            b = 0;
        if (H >= 0 && H <= 1) {
            r = chroma;
            g = X, b = 0;
        } else if (H >= 1 && H <= 2) {
            r = X;
            g = chroma;
            b = 0;
        } else if (H >= 2 && H <= 3) {
            r = 0;
            g = chroma, b = X;
        } else if (H >= 3 && H <= 4) {
            r = 0;
            g = X;
            b = chroma;
        } else if (H >= 4 && H <= 5) {
            r = X;
            g = 0;
            b = chroma;
        } else if (H >= 5 && H <= 6) {
            r = chroma;
            g = 0;
            b = X;
        }

        let m = L - chroma / 2;
        let RGB = [r + m, g + m, b + m].map(e => Math.floor(Math.round(e * 255)));
        return RGB;
    },
    RGBtoHEX: function(triplet) {
        return triplet.reduce(function(total, current) {
          return total += (current <= 10) ? (0 + current.toString(16)) : current.toString(16)  
        }, "#").toUpperCase();
    },
    HEXtoRGB: function(hex) {
        hex = (hex[0] === '#') ? hex.substr(1) : hex;
        let rgb = [];

        for(let i = 0; i < hex.length; i+=2) {
            let pair = `${hex[i]}${hex[i+1]}`
            rgb.push(parseInt(pair, 16));
        }

        return rgb;
    },
    complementOf: function(triplet, alpha) {
        let hsl = this.RGBtoHSL(triplet);

        hsl[0] = (hsl[0] < 180) ? (hsl[0] - 180) + 360 : hsl[0] - 180;
        if(alpha) hsl.push(0);
        if(hsl[2] === 100) hsl[2] = 0;

        return this.HSLtoRGB(hsl);
    }
}