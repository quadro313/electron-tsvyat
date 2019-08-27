import Vue from 'vue'
import Vuex from 'vuex'
const color = require('./helpers/color.js')

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    programSettings: {
      width: 500,
      height: 350,
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
        case 'hex': {
          return color.RGBtoHEX(state.color.RGB.value.clamped);
        }
      }
    },
    getComplementaryAs: state => (format) => {
      switch(format) {
        case 'rgb': {
          let compl = state.color.RGB.value.clamped.map(e => 255 - e);
          return `rgb(${compl})`;
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

      state.color.XYZ.value = color.RGBtoXYZ(payload.value.original);
      state.color.HSL.value = color.RGBtoHSL(payload.value.clamped);
    },
    updateXYZ(state, payload) {
      state.color.XYZ.value = payload.value;

      let rgb = color.XYZtoRGB(payload.value);
      state.color.RGB.value.original = rgb.original;
      state.color.RGB.value.clamped = rgb.clamped;
      state.color.HSL.value = color.RGBtoHSL(rgb.clamped);
    },
    updateHSL(state, payload) {
      state.color.HSL.value = payload.value;

      let rgb = color.HSLtoRGB(payload.value);
      state.color.RGB.value.original = rgb;
      state.color.RGB.value.clamped = rgb;

      state.color.XYZ.value = color.RGBtoXYZ(rgb);
    },
    updateHEX(state, payload) {
      let rgb = color.HEXtoRGB(payload.value);

      state.color.RGB.value.clamped = rgb;
      state.color.RGB.value.original = rgb;
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
      else if(m === 'HEX') {
        injectee.commit('updateHEX', payload);
      }
    }
  }
})