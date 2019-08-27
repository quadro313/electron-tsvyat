<template>
    <v-app :style="{backgroundColor: 'rgba(0,0,0,0)'}">
        <v-system-bar class="appBar" :color="color" dense app>
            <v-btn class="button" to='/' active-class="active" icon tile x-small>
                <v-icon :color="complementary">mdi-flask</v-icon>
            </v-btn>
            {{version}}
            <v-spacer></v-spacer>
            <v-btn class="button" ref="minimize" @click="appEvent('minimize')" icon tile x-small>
                <v-icon :color="complementary">mdi-window-minimize</v-icon>
            </v-btn>
            <v-btn class="button" ref="close" @click="appEvent('close')" icon tile x-small>
                <v-icon :color="complementary">mdi-window-close</v-icon>
            </v-btn>
        </v-system-bar>
        <v-content class="mainContent" min-height="100%">
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
            version: process.versions.electron
        }),
        computed: {
            color() {
                return this.$store.getters.getColorAs("alpha");
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
        background-color: transparent !important;
        overflow: hidden;
    }

    html, body {
        height: 0% !important;
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

    .mainContent {
        background-color: transparent !important;
    }

    .button {
        -webkit-app-region: no-drag;
    }

    .v-messages {
        min-height: 0 !important;
        height: 0 !important;
    }
</style>
