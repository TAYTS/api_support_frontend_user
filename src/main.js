import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store/index";
import "./registerServiceWorker";
import GoogleAuth from "vue-google-oauth";
import axios from "axios";

/*
 * Google login configuration
 */
Vue.use(GoogleAuth, {
  client_id: "secret.apps.googleusercontent.com"
});
Vue.googleAuth().load();

/*
 * Axios configuration
 */

Vue.prototype.$http = axios;
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
