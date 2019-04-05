<template>
  <div class="messaging-room__container">
    <v-toolbar class="messaging-room__header" dark color="accent">
      <v-btn icon class="hidden-xs-only" @click="ticketListing">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-toolbar-title>Ticket: {{ id }}</v-toolbar-title>
    </v-toolbar>
    <div class="messages__container">
      <MessageBubble
        v-for="message in messages"
        :key="message.index"
        :message="message.message"
        :type="message.type"
        :reply="message.reply"
        @download-media="downdloadMedia(message.index)"
      ></MessageBubble>
    </div>
    <v-textarea
      class="input-field"
      v-model="message"
      solo
      flat
      hide-details
      no-resize
      rows="5"
      label="Type here..."
      prepend-inner-icon="attach_file"
      color="accent"
      background-color="lightbackground"
      @keyup.enter="sendMessage"
    ></v-textarea>
  </div>
</template>

<script>
import MessageBubble from "@/components/MessageBubble.vue";

export default {
  name: "MessaggingRoom",
  components: {
    MessageBubble
  },
  data() {
    return {
      message: "",
      messages: [],
      channel: null
    };
  },
  props: ["id"],
  mounted() {
    this.channel = this.$store.getters["messages/getChannel"](this.id);
    this.$store
      .dispatch("messages/getMessages", { id_channel: this.id })
      .then(messages => {
        this.messages = [...messages];
        this.channel.on("messageAdded", this.updateMessage);
      });
  },
  methods: {
    ticketListing() {
      this.$router.replace({ name: "TicketListing" });
    },
    sendMessage() {
      const message = this.message;
      if (message.trim() !== "") {
        this.$store
          .dispatch("messages/sendMessage", {
            message,
            id_channel: this.id
          })
          .then(status => {
            if (status) {
              this.message = "";
            }
          });
      } else {
        this.message = "";
      }
    },
    updateMessage() {
      this.$store
        .dispatch("messages/getMessages", { id_channel: this.id })
        .then(messages => {
          this.messages = [...messages];
        });
    },
    downdloadMedia(index) {
      this.$store.dispatch("messages/downloadMedia", { index });
    }
  }
};
</script>

<style scoped>
.messaging-room__container {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
}

.messaging-room__header {
  border-radius: 5px 5px 0 0;
}

.messages__container {
  margin: 0;
  padding: 10px;
  background-color: #e6e6e6;
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 80%;
  min-height: 500px;
  max-height: 500px;
  overflow: auto;
}

.input-field {
  border-top: 1px solid #8c8c8c;
}
</style>
