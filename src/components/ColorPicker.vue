<template>
  <v-card color="rgba(0,0,0,0)" outlined>
    <v-container>
      <v-row align="center" dense>
        <v-col>
          <v-row align="center" dense class="py-0 my-0">
            <v-btn-toggle
              v-model="selectedColorMode"
              mandatory
              :style="{backgroundColor: `${backgroundColor}`}"
            >
              <v-btn
                v-for="c in $_.keys(colorLimits)"
                :key="c"
                :value="c"
                :color="foregroundColor"
                small
                outlined
              >{{c}}</v-btn>
              <v-btn :value="'TEXT'" :color="foregroundColor" small outlined>TEXT</v-btn>
            </v-btn-toggle>
          </v-row>
          <v-row v-if="selectedColorMode==='TEXT'">
            <v-text-field label="Hex or color name"></v-text-field>
          </v-row>
          <v-row
            v-else
            v-for="(val, index) in $_.keys(colorLimits[selectedColorMode])"
            dense
            :key="index"
          >
            <span class="pt-1" :style="{color: `${foregroundColor}`}">{{val}}</span>
            <v-slider
              v-on:input="updateColor"
              :color="foregroundColor"
              :track-color="foregroundColor"
              :step="colorLimits[selectedColorMode][val]['step']"
              :min="colorLimits[selectedColorMode][val]['min']"
              :max="colorLimits[selectedColorMode][val]['max']"
              v-model="selectedColor[index]"
            >
              <template #append>
                <input
                  :style="{width: '75px !important',color: `${foregroundColor}`, backgroundColor: `${backgroundColor}`}"
                  type="number"
                  v-model="selectedColor[index]"
                />
              </template>
            </v-slider>
          </v-row>
          <v-row dense>
            <span class="pt-1" :style="{color: `${foregroundColor}`}">A</span>
            <v-slider
              v-on:input="updateTransparency"
              :color="foregroundColor"
              :track-color="foregroundColor"
              :step=".01"
              :min="0.01"
              :max="1"
              v-model="alpha"
            >
              <template #append>
                <input
                  :style="{width: '75px !important',color: foregroundColor, backgroundColor: backgroundColor}"
                  type="number"
                  v-model="alpha"
                />
              </template>
            </v-slider>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
export default {
  name: "ColorPicker",
  props: ["backgroundColor", "foregroundColor"],
  data() {
    return {
      selectedColorMode: "RGB",
      selectedColor: [0, 0, 0],
      alpha: 1
    };
  },
  computed: {
    colorLimits: function() {
      return this.$store.getters.getColorLimits;
    }
  },
  watch: {
    selectedColorMode: function(newVal) {
      switch (newVal) {
        case "XYZ":
          {
            let v = this.$store.getters.getColorAs("xyz");
            this.selectedColor = v;
          }
          break;
        case "RGB":
          {
            let v = this.$store.getters.getColorAs("rgb_array");
            this.selectedColor = v;
          }
          break;
        case "HSL": {
          let v = this.$store.getters.getColorAs("hsl");
          this.selectedColor = v;
        }
      }
    }
  },
  methods: {
    updateColor() {
      let val =
        this.selectedColorMode === "RGB"
          ? { original: this.selectedColor, clamped: this.selectedColor }
          : this.selectedColor;
      this.$store.dispatch("updateColor", {
        mode: this.selectedColorMode,
        value: val,
        alpha: this.alpha
      });
    },
    updateTransparency() {
      this.$store.commit("updateTransparency", {
        enabled: this.alpha === 1,
        alpha: this.alpha
      });
    }
  },
  created() {
    this.selectedColor = this.$store.getters.getColorAs("rgb_array");
  }
};
</script>

<style>
</style>