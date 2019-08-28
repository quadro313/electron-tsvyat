<template>
  <v-card :color="backgroundColor" outlined>
    <v-container>
      <v-row align="center" justify="center" dense>
        <span :style="{color: `${foregroundColor}`}">Copy as:</span>
      </v-row>
      <v-row align="center" justify="center" dense>
        <v-btn
        @click="copyColor('RGB')"
          :color="foregroundColor"
          :title="RGB"
          small
          outlined
          text
          block
        >RGB</v-btn>
      </v-row>
      <v-row align="center" justify="center" dense>
        <v-btn
        @click="copyColor('HEX')"
          :color="foregroundColor"
          :title="HEX"
          small
          outlined
          text
          block
        >HEX</v-btn>
      </v-row>
      <v-row align="center" justify="center" dense>
        <v-btn
        @click="copyColor('HSL')"
          :color="foregroundColor"
          :title="HSL"
          small
          outlined
          text
          block
        >HSL</v-btn>
      </v-row>
      <v-row align="center" justify="center" dense>
        <v-btn
        @click="copyColor('XYZ')"
          :color="foregroundColor"
          :title="XYZ"
          small
          outlined
          text
          block
        >XYZ</v-btn>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
const clipboardy = require('clipboardy');

export default {
  name: "ColorPanel",
  props: ["backgroundColor", "foregroundColor"],
  data() {
    return {};
  },
  computed: {
    RGB: function() {
      let transparency = this.$store.getters.transparency;
      if (transparency.enabled)
        return `rgba(${this.$store.getters.getColorAs("rgb_array")},${
          transparency.value
        })`;
      else return `rgb(${this.$store.getters.getColorAs("rgb_array")})`;
    },
    HSL: function() {
      let transparency = this.$store.getters.transparency;
      if (transparency.enabled)
        return `hsl(${this.$store.getters.getColorAs("hsl")},${
          transparency.value
        })`;
      else return `hsl(${this.$store.getters.getColorAs("hsl")})`;
    },
    XYZ: function() {
      let transparency = this.$store.getters.transparency;
      if (transparency.enabled)
        return `xyz(${this.$store.getters.getColorAs("xyz")},${
          transparency.value
        })`;
      else return `xyz(${this.$store.getters.getColorAs("xyz")})`;
    },
    HEX: function() {
        return this.$store.getters.getColorAs('hex');
    }
  },
  methods: {
      copyColor: function(which) {
          switch(which) {
              case 'RGB': clipboardy.writeSync(this.RGB); break;
              case 'HSL': clipboardy.writeSync(this.HSL); break;
              case 'XYZ': clipboardy.writeSync(this.XYZ); break;
              case 'HEX': clipboardy.writeSync(this.HEX); break;
          }
      }
  }
};
</script>

<style>
</style>