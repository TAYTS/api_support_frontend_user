import Vue from "vue";
import Router from "vue-router";
import LoginPage from "./views/LoginPage.vue";
import Dashboard from "./views/Dashboard.vue";
import TicketListing from "./components/TicketListing.vue";
import Messaging from "./components/Messaging";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/login",
      name: "LoginPage",
      component: LoginPage
    },
    {
      path: "/",
      name: "Dashboard",
      component: Dashboard,
      children: [
        {
          path: "ticket-listing",
          name: "TicketListing",
          component: TicketListing
        },
        {
          path: ":id",
          name: "Messaging",
          component: Messaging
        }
      ]
    }
  ]
});
