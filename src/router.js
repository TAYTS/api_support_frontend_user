import Vue from "vue";
import Router from "vue-router";
import LoginPage from "./views/LoginPage.vue";
import Dashboard from "./views/Dashboard.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "Dashboard",
      component: Dashboard
    },
    {
      path: "/login",
      name: "LoginPage",
      component: LoginPage
    }
  ]
});
