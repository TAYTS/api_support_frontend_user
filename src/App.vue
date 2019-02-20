<template>
  <v-app id="app">
    <router-view/>
  </v-app>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
@font-face {
  font-family: "HelveticaNeueMedium";
  src: url(./assets/fonts/Helvetica-Neue-Medium.ttf);
}

*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "HelveticaNeueMedium";
}

html,
body {
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

v-app {
  width: 100%;
  height: 100%;
}
</style>
