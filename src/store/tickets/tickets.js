import axios from "../../axios/loginAxios";

const state = {
  open: [],
  close: []
};

const actions = {
  getTickets() {
    let status = 0;
    const access_token = localStorage.getItem("access_token");
    if (access_token) {
      return axios
        .get("/tickets/retrieve-tickets", {
          headers: {
            "X-CSRF-TOKEN": access_token
          }
        })
        .then(response => {
          if (response.status === 200) {
            return response.data;
          } else {
            // Error when trying to get tickets
            return 0;
          }
        });
    } else {
      // Invalid credential
      status = 0;
      return new Promise(resolve => {
        resolve(status);
      });
    }
  }
};

const mutations = {
  addTickets(state, tickets) {
    state.open = tickets.open;
    state.close = tickets.close;
  }
};

export const tickets = {
  namespaced: true,
  state,
  actions,
  mutations
};
