<template>
    <v-container :style="{backgroundColor: alpha, height: '100%', borderTop: `1px solid ${complementary}`}" min-height="100%"
                 height="100%" class="py-0 my-0">
        <v-row align="stretch">
            <v-col cols="8" class="py-0 my-0 px-1">
                <ColorPicker :backgroundColor="alpha" :foregroundColor="complementary"></ColorPicker>
            </v-col>
            <v-col class="py-0 my-0 px-1">
                <ColorPanel :backgroundColor="alpha" :foregroundColor="complementary"></ColorPanel>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import ColorPicker from '../components/ColorPicker'
    import ColorPanel from '../components/ColorPanel'
    const color = require('../helpers/color.js');

    export default {
        name: "Home",
        components: {
            ColorPicker,
            ColorPanel
        },
        data() {
            return {
                transparency: true
            }
        },
        computed: {
            alpha() {
                return this.$store.getters.getColorAs("alpha");
            },
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
