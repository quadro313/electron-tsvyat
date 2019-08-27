<template>
    <v-container :style="{backgroundColor: color, height: '100%', borderTop: `1px solid ${complementary}`}" min-height="100%"
                 height="100%" class="py-0 my-0">
        <v-row align="stretch">
            <v-col cols="8" class="py-0 my-0">
                <ColorPicker :backgroundColor="color" :foregroundColor="complementary" :transparency="transparency"></ColorPicker>
            </v-col>
            <v-col class="py-0 my-0">
                <v-card :color="color" raised outlined>
                    <v-container>
                        <v-row align="stretch">
                            
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
    import ColorPicker from '../components/ColorPicker'
    const color = require('../helpers/color.js');

    export default {
        name: "Home",
        components: {
            ColorPicker
        },
        data() {
            return {
                transparency: true
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
            }
        },
        watch: {
          
        },
        methods: {
            
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
