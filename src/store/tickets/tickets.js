import axios from "../../axios/ticketAxios";

const state = {
  open: [],
  close: []
};

const actions = {
  getTickets() {
    const access_token = localStorage.getItem("access_token");
    if (access_token) {
      return axios
        .get("/tickets/retrieve-user-tickets", {
          headers: {
            "X-CSRF-TOKEN": access_token
          }
        })
        .then(response => {
          if (response.status === 200) {
            return response.data;
          }
        })
        .catch(() => {
          // Error when fetching tickets
          return 0;
        });
    } else {
      // Invalid credential
      return new Promise(resolve => {
        resolve(0);
      });
    }
  },
  createTicket(context, payload) {
    const access_token = localStorage.getItem("access_token");
    if (access_token) {
      return axios
        .post("/tickets/create-tickets", payload, {
          headers: {
            "X-CSRF-TOKEN": access_token
          }
        })
        .then(response => {
          if (response.status === 201 && response.data.id_ticket) {
            return response.data.id_ticket;
          } else {
            return 0;
          }
        })
        .catch(error => {
          console.log(error);
          return 0;
        });
    } else {
      // Invalid credential
      return new Promise(resolve => {
        resolve(0);
      });
    }
  },
  resolveTicket(context, id_ticket_hash) {
    const access_token = localStorage.getItem("access_token");
    if (access_token) {
      return axios
        .put("/tickets/resolve-ticket", id_ticket_hash, {
          headers: {
            "X-CSRF-TOKEN": access_token
          }
        })
        .then(response => {
          if (response.status === 200 && response.data.status === 1) {
            return response.data.status;
          } else {
            return 0;
          }
        })
        .catch(() => {
          return 0;
        });
    } else {
      // Invalid credential
      return new Promise(resolve => {
        resolve(0);
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
