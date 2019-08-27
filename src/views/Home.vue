<template>
    <v-container :style="{backgroundColor: color, height: '100%', borderTop: `1px solid ${complementary}`}" min-height="100%"
                 height="100%" class="py-0 my-0">
        <v-row align="stretch">
            <v-col cols="8" class="py-0 my-0">
                <v-card :color="color" raised outlined>
                    <v-container>
                        <v-row align="center" dense>
                            <v-col>
                                <v-row align="center" :color="complementary" dense class="py-0 my-0">
                                    <v-btn-toggle v-model="selectedColorMode" mandatory>
                                        <v-btn v-for="c in $_.keys(colorLimits)"
                                               :key="c"
                                               :value="c"
                                               :color="complementary"
                                               :style="{backgroundColor: `${color}`}"
                                               small outlined>
                                            {{c}}
                                        </v-btn>
                                    </v-btn-toggle>
                                </v-row>
                                <v-row v-for="(val, index) in $_.keys(colorLimits[selectedColorMode])" dense :key="index">
                                    <span class="pt-1" :style="{color: `${complementary}`}">{{val}}</span>
                                    <v-slider v-on:input="updateColor"
                                              :color="complementary"
                                              :track-color="complementary"
                                              :step="colorLimits[selectedColorMode][val]['step']"
                                              :min="colorLimits[selectedColorMode][val]['min']"
                                              :max="colorLimits[selectedColorMode][val]['max']"
                                              v-model="selectedColor[index]">
                                        <template #append>
                                            <input :style="{width: '75px !important',color: `${complementary}`, backgroundColor: `${color}`}" type="number"
                                                   v-model="selectedColor[index]"/>
                                        </template>
                                    </v-slider>
                                </v-row>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-col>
            <v-col class="py-0 my-0">
                <v-card :color="color" raised outlined>
                    <v-container>
                        <v-row align="stretch">
                            <v-text-field v-model="hex"></v-text-field>
                        </v-row>
                    </v-container>
                </v-card>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-card :color="color" raised outlined>
                    hi
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        name: "Home",
        data() {
            return {
                selectedColorMode: "RGB",
                selectedColor: [0, 0, 0],
                self: this
            }
        },
        computed: {
            color() {
                return this.$store.getters.getColorAs("rgb");
            },
            complementary() {
                return this.$store.getters.getComplementaryAs("rgb");
            },
            colorLimits() {
                return this.$store.getters.getColorLimits;
            },
            hex: {
                get: function() {
                    return this.$store.getters.getColorAs("hex");
                },
                set: function(v) {
                    this.$store.commit('updateHEX', {value: v});
                }
            }
        },
        watch: {
          selectedColorMode: function(newVal) {
              switch(newVal) {
                  case 'XYZ': {
                      let v = this.$store.getters.getColorAs('xyz');
                      this.selectedColor = v;
                  } break;
                  case 'RGB': {
                      let v = this.$store.getters.getColorAs('rgb_array');
                      this.selectedColor = v;
                  } break;
                  case 'HSL': {
                      let v = this.$store.getters.getColorAs('hsl');
                      this.selectedColor = v;
                  }
              }
          }
        },
        methods: {
            updateColor() {
                let val = (this.selectedColorMode === 'RGB') ? {original: this.selectedColor, clamped: this.selectedColor} : this.selectedColor;
                this.$store.dispatch("updateColor", {mode: this.selectedColorMode, value: val});
            }
        },
        created() {
            this.selectedColor = this.$store.getters.getColorAs("rgb_array");
        }
    }
</script>

<style scoped>
    input[type=number]::-webkit-inner-spin-button,
    input[type=number]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
</style>
