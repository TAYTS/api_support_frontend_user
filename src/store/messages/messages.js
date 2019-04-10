import axios from "../../axios/messageAxios";
const Chat = require("twilio-chat");

const state = {
  client: null,
  channels: [],
  messages: []
};

const actions = {
  initClient({ commit }) {
    const access_token = localStorage.getItem("access_token");
    const client = this.getters["messages/getClient"];
    if (client === null) {
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
    } else {
      return new Promise(resolve => {
        resolve(1);
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
  async sendMedia(context, { files, id_channel }) {
    const channel = this.getters["messages/getChannel"](id_channel);
    let total = 0;
    for (let i = 0, file, formData; i < files.length; i++) {
      file = files[i];
      formData = new FormData();
      formData.append("file", file.file);
      const idx = await channel.sendMessage(formData);
      total += idx;
    }
    return new Promise(resolve => {
      resolve(total);
    });
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
      return message.media.getContentUrl().then(url => {
        return axios({
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
          return 1;
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
    let message;
    for (let i = 0; i < state.messages.length; i++) {
      if (state.messages[i].index === index) {
        message = state.messages[i];
        break;
      }
    }
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
