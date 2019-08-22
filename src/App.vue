<template>
    <v-app>
        <v-system-bar class="appBar" :color="color" dense app>
            <v-btn class="button" to='/' active-class="active" icon tile x-small>
                <v-icon :color="complementary">mdi-heart</v-icon>
            </v-btn>
            <v-btn class="button" @click="appEvent('eyedropper')" icon tile x-small>
                <v-icon :color="complementary">mdi-eyedropper</v-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn class="button" ref="minimize" @click="appEvent('minimize')" icon tile x-small>
                <v-icon :color="complementary">mdi-window-minimize</v-icon>
            </v-btn>
            <v-btn class="button" ref="close" @click="appEvent('close')" icon tile x-small>
                <v-icon :color="complementary">mdi-window-close</v-icon>
            </v-btn>
        </v-system-bar>
        <v-content min-height="100%">
            <keep-alive>
                <router-view></router-view>
            </keep-alive>
        </v-content>
    </v-app>
</template>

<script>
    export default {
        name: 'App',
        data: () => ({
            
        }),
        computed: {
            color() {
                return this.$store.getters.getColorAs("rgb");
            },
            complementary() {
                return this.$store.getters.getComplementaryAs("rgb");
            }
        },
        methods: {
            appEvent(event) {
                if (event === "minimize" || event === "close") {
                    this.$refs[event].$el.blur();
                    this.$electron.renderer.send("appEvent", {payload: event});
                }
                if(event === 'eyedropper') {
                    this.$electron.renderer.send('eyedropper');
                }
            }
        }
    };
</script>
<style>
    html {
        overflow: hidden;
    }

    .v-btn.active {
        background: rgba(0, 0, 0, .30);
    }

    ::-webkit-scrollbar {
        display: none;
    }

    .appBar {
        -webkit-app-region: drag;
    }

    .button {
        -webkit-app-region: no-drag;
    }

    .v-messages {
        min-height: 0 !important;
        height: 0 !important;
    }
</style>
