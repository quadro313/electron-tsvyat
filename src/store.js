import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    programSettings: {
      width: 450,
      height: 300,
      pinned: false,
      frame: false,
      resizable: false,
      maximizable: false,
      docked: false,
      formats: {

      }
    },
    colorLimits: {
      RGB: {
        R: {
          step: 1,
          min: 0,
          max: 255
        },
        G: {
          step: 1,
          min: 0,
          max: 255
        },
        B: {
          step: 1,
          min: 0,
          max: 255
        }
      },
      XYZ: {
        X: {
          step: 0.001,
          min: 0,
          max: 95.047
        },
        Y: {
          step: 0.001,
          min: 0,
          max: 100
        },
        Z: {
          step: 0.001,
          min: 0,
          max: 108.883
        }
      },
      HSL: {
        H: {
          step: 1,
          min: 0,
          max: 360
        },
        S: {
          step: 1,
          min: 0,
          max: 100
        },
        L: {
          step: 1,
          min: 0,
          max: 100
        }
      }
    },
    color: {
      RGB: {
        value: {
          original: [255, 255, 255],
          clamped: [255, 255, 255]
        }
      },
      XYZ: {
        value: [95.047, 100, 108.883]
      },
      HSL: {
        value: [360, 100, 100]
      }
    }
  },
  getters: {
    getProgramSettings: state => {
      return state.programSettings;
    },
    getColorLimits: state => {
      return state.colorLimits;
    },
    getColorAs: state => (format) => {
      switch(format) {
        case 'rgb': {
          return `rgb(${state.color.RGB.value.clamped})`;
        }
        case 'rgb_array': {
          return state.color.RGB.value.clamped;
        }
        case 'xyz': {
          return state.color.XYZ.value;
        }
        case 'hsl': {
          return state.color.HSL.value;
        }
      }
    },
    getComplementaryAs: state => (format) => {
      switch(format) {
        case 'rgb': {
          let compl = state.color.RGB.value.clamped.map(e => 255 - e);
          return `rgb(${compl})`
        }
        case 'rgb_array': {
          let compl = state.color.RGB.value.clamped.map(e => 255 - e);
          return compl;
        }
      }
    }
  },
  mutations: {
    updateRGB(state, payload) {
      state.color.RGB.value.original = payload.value.original;
      state.color.RGB.value.clamped = payload.value.clamped;

      state.color.XYZ.value = RGBtoXYZ(payload.value.original);
      state.color.HSL.value = RGBtoHSL(payload.value.clamped);
    },
    updateXYZ(state, payload) {
      state.color.XYZ.value = payload.value;

      let rgb = XYZtoRGB(payload.value);
      state.color.RGB.value.original = rgb.original;
      state.color.RGB.value.clamped = rgb.clamped;
      state.color.HSL.value = RGBtoHSL(rgb.clamped);
    },
    updateHSL(state, payload) {
      state.color.HSL.value = payload.value;

      let rgb = HSLtoRGB(payload.value);
      state.color.RGB.value.original = rgb;
      state.color.RGB.value.clamped = rgb;

      state.color.XYZ.value = RGBtoXYZ(rgb);
    }
  },
  actions: {
    updateColor: (injectee, payload) => {
      let m = payload.mode;
      if(m === 'RGB') {
        injectee.commit('updateRGB', payload);
      }
      else if(m === 'XYZ') {
        injectee.commit('updateXYZ', payload);
      }
      else if(m === 'HSL') {
        injectee.commit('updateHSL', payload);
      }
    }
  }
})

function RGBtoXYZ(triplet) {
  triplet = triplet.map(e => e / 255);

  for(let i = 0; i < triplet.length; i++) {
    triplet[i] = (triplet[i] > 0.04045) ? Math.pow( ((triplet[i] + 0.055) / 1.055), 2.4 ) : (triplet[i] / 12.92);
  }

  triplet = triplet.map(e => e * 100);
  let X = (triplet[0] * 0.4124564) + (triplet[1] * 0.3575761) + (triplet[2] * 0.1804375);
  let Y = (triplet[0] * 0.2126729) + (triplet[1] * 0.7151522) + (triplet[2] * 0.0721750);
  let Z = (triplet[0] * 0.0193339) + (triplet[1] * 0.1191920) + (triplet[2] * 0.9503041);

  let result = [X, Y, Z];
  result = result.map(e => {
    let s = e.toFixed(4).toString();
    s = Number(s.substr(0, s.length-1));
    return s;
  });

  return result;
}

function XYZtoRGB(triplet) {
  triplet = triplet.map(e => e / 100);

  let R = triplet[0] *  3.2406 + triplet[1] * -1.5372 + triplet[2] * -0.4986;
  let G = triplet[0] * -0.9689 + triplet[1] *  1.8758 + triplet[2] *  0.0415;
  let B = triplet[0] *  0.0557 + triplet[1] * -0.2040 + triplet[2] *  1.0570;
  let result = [R, G, B];

  for(let i = 0; i < result.length; i++) {
    result[i] = (result[i] > 0.0031308) ? ((1.055 * Math.pow(result[i], 1/2.4)) - 0.055) : (result[i] * 12.92);
  }

  let original = result.map(e => Math.floor(Math.round(e * 255)));
  let clamped = original.map(e => {
    return (e < 0) ? 0 : (e > 255) ? 255 : e;
  });

  return {original: original, clamped: clamped};
}

function RGBtoHSL(triplet) {
  triplet = triplet.map(e => e / 255)
  let min = Math.min(...triplet);
  let max = Math.max(...triplet);

  let chroma = max - min

  let h;
  if(chroma === 0) h = 0;
  else if(max === triplet[0]) {
    h = ((triplet[1] - triplet[2]) / chroma) % 6;
  }
  else if(max === triplet[1]) {
    h = ((triplet[2] - triplet[0]) / chroma) + 2;
  }
  else if(max === triplet[2]) {
    h = ((triplet[0] - triplet[1]) / chroma) + 4;
  }

  let H = h * 60;
  let L = (max + min) / 2;
  let S = (L === 0 || L === 1) ? 0 : (chroma / (1 - Math.abs(2 * L - 1)))

  let res = [H, S*100, L*100].map(e=> Math.floor(Math.round(e)))

  return res;
}

function HSLtoRGB(triplet) {
  let H = triplet[0];
  let S = triplet[1] / 100;
  let L = triplet[2] / 100;

  let chroma = (1 - Math.abs(2 * L - 1)) * S;
  H /= 60;
  let X = chroma * (1 - Math.abs(H%2 - 1));

  let r = 0, g = 0, b = 0;
  if(H >= 0 && H <= 1) {
    r = chroma; g = X, b = 0;
  }
  else if(H >= 1 && H <= 2) {
    r = X; g = chroma; b = 0;
  }
  else if(H >= 2 && H <= 3) {
    r = 0; g = chroma, b = X;
  }
  else if(H >= 3 && H <= 4) {
    r = 0; g = X; b = chroma;
  }
  else if(H >= 4 && H <= 5) {
    r = X; g = 0; b = chroma;
  }
  else if(H >= 5 && H <= 6) {
    r = chroma; g = 0; b = X;
  }

  let m = L - chroma/2;
  let RGB = [r + m, g + m, b + m].map(e => Math.floor(Math.round(e * 255)));
  return RGB;
}
