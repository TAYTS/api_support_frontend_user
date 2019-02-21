import Vue from "vue";
import Router from "vue-router";
import Dash from "./views/Dash.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "Dash",
      component: Dash
    }
  ]
});
