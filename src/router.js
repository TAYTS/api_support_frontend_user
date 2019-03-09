import Vue from "vue";
import Router from "vue-router";
import UserPage from "./views/UserPage";
import LoginPage from "./views/LoginPage.vue";
import Dash from "./views/Dash.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "UserPage",
      component: UserPage
    },
    {
      path: "/login",
      name: "LoginPage",
      component: LoginPage
    },
    {
      path: "/dashboard",
      name: "Dash",
      component: Dash
    }
  ]
});
