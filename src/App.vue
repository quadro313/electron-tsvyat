<template>
    <v-app>
        <v-system-bar class="appBar" :color="color" dense app>
            <v-btn class="button" to='/' icon tile x-small>
                <v-icon>mdi-heart</v-icon>
            </v-btn>
            <v-btn class="button" to='/about' icon tile x-small>
                <v-icon>mdi-palette</v-icon>
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
            }
        }
    };
</script>
<style>
    html {
        overflow: hidden;
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
