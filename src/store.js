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
    },
    updateXYZ(state, payload) {
      state.color.XYZ.value = payload.value;

      let rgb = XYZtosRGB(payload.value);
      state.color.RGB.value.original = rgb.original;
      state.color.RGB.value.clamped = rgb.clamped;
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

function XYZtosRGB(triplet) {
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
