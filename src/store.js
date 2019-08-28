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
      transparent: true,
      backgroundColor: "#00000000",
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
      transparencyEnabled: false,
      value: {
        original: [255,255,255],
        clamped: [255,255,255],
        alpha: 1
      }
    }
  },
  getters: {
    transparencyEnabled: state => {
      return state.color.transparencyEnabled;
    },
    getProgramSettings: state => {
      return state.programSettings;
    },
    getColorLimits: state => {
      return state.colorLimits;
    },
    getColorAs: state => (format) => {
      switch(format) {
        case 'rgb': {
          return `rgb(${state.color.value.clamped})`;
        }
        case 'rgb_array': {
          return state.color.value.clamped;
        }
        case 'xyz': {
          return color.RGBtoXYZ(state.color.value.clamped);
        }
        case 'hsl': {
          return color.RGBtoHSL(state.color.value.clamped);
        }
        case 'hex': {
          return color.RGBtoHEX(state.color.value.clamped);
        }
        case 'alpha': {
          return `rgba(${state.color.value.clamped}, ${state.color.value.alpha})`
        }
      }
    },
    getComplementaryAs: state => (format) => {
      switch(format) {
        case 'rgb': {
          let compl = color.complementOf(state.color.value.clamped);
          return `rgba(${compl}, 1)`;
        }
        case 'rgb_array': {
          let compl = state.color.value.clamped.map(e => 255 - e);
          return compl;
        }
      }
    }
  },
  mutations: {
    transparencyMode(state, payload) {
      state.color.transparencyEnabled = payload.value;
    },
    updateRGB(state, payload) {
      state.color.value.alpha = payload.alpha;
      state.color.value.original = payload.value.original;
      state.color.value.clamped = payload.value.clamped;
    },
    updateXYZ(state, payload) {
      state.color.value.alpha = payload.alpha;
      let rgb = color.XYZtoRGB(payload.value);
      state.color.value.original = rgb.original;
      state.color.value.clamped = rgb.clamped;
    },
    updateHSL(state, payload) {
      state.color.value.alpha = payload.alpha;
      let rgb = color.HSLtoRGB(payload.value);
      state.color.value.original = rgb;
      state.color.value.clamped = rgb;
    },
    updateHEX(state, payload) {
      let rgb = color.HEXtoRGB(payload.value);
      state.color.value.clamped = rgb;
      state.color.value.original = rgb;
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