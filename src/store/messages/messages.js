import axios from "../../axios/loginAxios";
const Chat = require("twilio-chat");

const state = {
  client: null,
  channels: [],
  messages: []
};

const actions = {
  initClient({ commit }) {
    const access_token = localStorage.getItem("access_token");
    if (access_token) {
      // Get the Twilio access token
      return axios
        .get("/messages/get_access_token", {
          headers: {
            "X-CSRF-TOKEN": access_token
          }
        })
        .then(response => {
          if (response.status === 200) {
            // Create Twilio chat client
            const result = Chat.Client.create(response.data.token)
              .then(client => {
                client.on("tokenAboutToExpire", () => {
                  renewToken();
                });
                commit("storeClient", client);
                // Get all the subscribed channels
                // client.on("synchronizationStatusUpdated");
                let channels = [];
                const result = client
                  .getSubscribedChannels()
                  .then(paginator => {
                    for (let i = 0; i < paginator.items.length; i++) {
                      channels.push(paginator.items[i]);
                    }
                    commit("storeChannels", channels);
                    return 1;
                  })
                  .catch(() => {
                    return 0;
                  });

                return result;
              })
              .catch(() => {
                return 0;
              });
            return result;
          } else {
            return 0;
          }
        });
    } else {
      return new Promise(resolve => {
        resolve(0);
      });
    }
  },
  terminateClient() {
    // Release resources
    state.client.shutdown();
  },
  sendMessage(context, { message, id_channel }) {
    const channel = this.getters["messages/getChannel"](id_channel);
    channel.sendMessage(message);
    return 1;
  },
  sendMedia(context, { files, id_channel }) {
    const channel = this.getters["messages/getChannel"](id_channel);
    for (let i = 0, file, formData; i < files.length; i++) {
      file = files[i];
      formData = new FormData();
      formData.append("file", file.file);
      channel.sendMessage(formData);
    }
    return 1;
  },
  updateChannels({ commit }) {
    const client = this.getters["messages/getClient"];
    let channels = [];
    return client
      .getSubscribedChannels()
      .then(paginator => {
        for (let i = 0; i < paginator.items.length; i++) {
          channels.push(paginator.items[i]);
        }
        commit("storeChannels", channels);
        return 1;
      })
      .catch(() => {
        return 0;
      });
  },
  getMessages({ commit }, { id_channel }) {
    const channel = this.getters["messages/getChannel"](id_channel);
    const id_user_hash = this.getters["user/getUser"];
    let msgStore = [];
    if (channel) {
      return channel.getMessages().then(messages => {
        commit("storeMessages", messages.items);
        const totalMessages = messages.items.length;
        for (let i = 0; i < totalMessages; i++) {
          const message = messages.items[i];
          if (message.author === id_user_hash) {
            msgStore.push({
              message:
                message.type === "text" ? message.body : message.media.filename,
              type: message.type,
              index: message.index,
              reply: false
            });
          } else {
            msgStore.push({
              message:
                message.type === "text" ? message.body : message.media.filename,
              type: message.type,
              index: message.index,
              reply: true
            });
          }
        }
        return msgStore;
      });
    } else {
      return msgStore;
    }
  },
  downloadMedia(context, { index }) {
    const message = this.getters["messages/getMessage"](index);
    if (message) {
      message.media.getContentUrl().then(url => {
        axios({
          url: url,
          responseType: "blob",
          withCredentials: false
        }).then(response => {
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", message.media.filename);
          document.body.appendChild(link);
          link.click();
        });
      });
    }
  }
};

const mutations = {
  storeClient(state, client) {
    state.client = client;
  },
  storeChannels(state, channels) {
    state.channels = [...channels];
  },
  storeMessages(state, messages) {
    state.messages = [...messages];
  }
};

const getters = {
  getClient: state => {
    return state.client;
  },
  getChannel: state => unique_id => {
    const channel = state.channels.filter(channel => {
      return channel.uniqueName === unique_id;
    })[0];
    return channel;
  },
  getMessage: state => index => {
    const message = state.messages[index];
    return message;
  }
};

/*
 * Helper functions
 */
function renewToken() {
  const access_token = localStorage.getItem("access_token");
  if (access_token) {
    axios
      .get("/messages/get_access_token", {
        headers: {
          "X-CSRF-TOKEN": access_token
        }
      })
      .then(response => {
        if (response.status === 200) {
          state.client.updateToken(response.data.token);
        }
      });
  }
}

export const messages = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
