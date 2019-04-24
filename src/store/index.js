import Vue from "vue";
import Vuex from "vuex";
import { user } from "./user/user.js";
import { tickets } from "./tickets/tickets.js";
import { messages } from "./messages/messages.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    tickets,
    messages
  }
});
